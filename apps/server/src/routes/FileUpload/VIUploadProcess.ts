import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import httpStatus from "http-status";
import { InsertResult } from "typeorm";
import { checkFileType } from "../../middlewares";
import {
    Invoice,
    InvoiceInterface,
    InvoiceLine,
    PaymentSchedule,
} from "../../models";
import { __prod__ } from "../../scripts/dev";
import validateIds from "../../scripts/genericUtils/checkIds";
import { OmittedInvoice } from "../../scripts/genericUtils/type";
import CsvParser from "../../scripts/parser/csvParser";
import DataVerifier from "../../scripts/parser/dataVerifier";
import { GenerateCsv } from "../../scripts/parser/generateCsv";
import DatabaseTransaction from "../../scripts/transection/databaseTransection";
import { increment } from "../../scripts/utils/revokeRefreshToken";
import {
    FileStatusType,
    LineStatusType,
    TypedRequest,
    TypedResponse,
} from "../../types";
import { Routes } from "../../types/routePath";

import errorHandler from "../../middlewares/errorHandler";
import { SuperGenerate } from "../../scripts/generator/eventGenerate";
import { GatherVdsbs } from "../../scripts/genericUtils/gatherVdsbs";
import GroupBY from "../../scripts/groupBy";
import ErrorMatcher from "../../scripts/utils/errorMatcher";
import forAll from "../../scripts/utils/forAll";
import { invoiceOperation } from "../../services";

//TODO: move streams data buffering to actual drain method
export type Header = Array<{
    [P in keyof Args<OmittedInvoice>]: Args<OmittedInvoice>[P];
}>;

const router = Router();
const fileRoute = () =>
    fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        debug: !__prod__,
    });

const DELIMITER = ";";
const LINE = "L";
const HEAD = "H";
const RATE_LIMIT = 5;

router.post(
    Routes.PROCESS_INVOICE_UPLOAD,
    fileRoute(),
    checkFileType,
    errorHandler.handleWithAuth(
        async (req: TypedRequest, res: TypedResponse) => {
            const file = req.files?.file as UploadedFile;

            const fileName = file.name;
            const { user } = req;

            const fileProcessid = await increment("invoice_file_process_id");

            const parser = new CsvParser<InvoiceInterface>(DELIMITER);

            parser.readData(file.data.toString());
            // @ts-ignore
            parser.matcher(async (err, parsedData) => {
                if (err || !parsedData || !parsedData.size) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: err?.message ? err.message : "bad request",
                    });
                }

                const viDataVerifier = new DataVerifier("vi");
                viDataVerifier.setVIData(Array.from(parsedData));
                viDataVerifier.validate();

                const superGen = new SuperGenerate<InvoiceInterface>(
                    viDataVerifier.getVIData as any,
                    "gen_csv",
                    fileName
                );

                if (viDataVerifier.errors.size) {
                    const generateCsv = new GenerateCsv<InvoiceInterface>(
                        viDataVerifier.errors,
                        viDataVerifier.getVIData as any
                    );

                    try {
                        await generateCsv.generate(fileName);
                    } catch (err) {
                        return res
                            .status(httpStatus.INTERNAL_SERVER_ERROR)
                            .json({
                                message: "an error accured try again later",
                            });
                    }

                    return res.status(httpStatus.BAD_REQUEST).json({
                        message:
                            "invalid column type detected please fix that type and try again",
                    });
                }

                viDataVerifier.readData(Array.from(parsedData));

                const grouped = new GroupBY().readData([...parsedData]).group();

                if (grouped.abandoned.size) {
                    let errorMsg =
                        "external_v_code or external_bs_code or external_ds_code must match with each other";

                    grouped.abandoned.forEach((value) => {
                        const [index, val] = value;
                        const itemValue = val[0];
                        superGen.emit(
                            "gen_csv",
                            new Map().set(
                                viDataVerifier.genKeys(
                                    index,
                                    "external_v_code"
                                ),
                                errorMsg
                            )
                        );
                    });

                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: errorMsg,
                    });
                }

                const viVerifierAmount = viDataVerifier.validateViAmount();
                if (Array.from(viVerifierAmount.keys()).includes(false)) {
                    const index = viVerifierAmount.get(false) as number;
                    const errorMsg =
                        "amount that you provided doesn't matched with its lines";
                    superGen.emit(
                        "gen_csv",
                        new Map().set(
                            viDataVerifier.genKeys(index, "amount"),
                            errorMsg
                        )
                    );
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: errorMsg,
                    });
                }

                const invoiceInsertResp: {
                    header: Array<{
                        [P in keyof Args<OmittedInvoice>]: Args<OmittedInvoice>[P];
                    }>;
                    line: Array<Args<OmittedInvoice>>;
                } = { header: [], line: [] };

                const insertQueue: Array<Promise<Args<InvoiceInterface>>> = [];

                for (const record of viDataVerifier.getVIData) {
                    insertQueue.push(
                        InvoiceInterface.create({
                            ...record,
                            file_name: fileName,
                            file_process_id: fileProcessid,
                            created_by: user,
                            updated_by: user,
                        }).save()
                    );
                }
                const resp = await Promise.all(insertQueue);

                for (let i = 0; i < resp.length; i++) {
                    const {
                        created_at,
                        created_by,
                        updated_at,
                        updated_by,
                        ...args
                    } = resp[i];
                    if (resp[i].record_type === HEAD) {
                        invoiceInsertResp.header.push(args);
                    } else if (resp[i].record_type === LINE) {
                        invoiceInsertResp.line.push(args);
                    }
                }

                const groupedIteratedArray = Array.from(grouped.map.values());
                for (let j = 0; j < groupedIteratedArray.length; j++) {
                    const item = groupedIteratedArray[j][1][0];
                    const len = groupedIteratedArray.length;
                    const vdsbsId = await new GatherVdsbs(item as any).gather();
                    if (!vdsbsId) {
                        let errorMsg = "vdsbs id not found";
                        superGen.emit(
                            "gen_csv",
                            new Map().set(
                                viDataVerifier.genKeys(
                                    j * len,
                                    "external_v_code"
                                ),
                                errorMsg
                            )
                        );
                        return res.status(httpStatus.BAD_REQUEST).json({
                            message: errorMsg,
                        });
                    }
                }

                forAll.readData(invoiceInsertResp.header);
                if (forAll.psChecker()) {
                    return res.status(httpStatus.OK).json({
                        message:
                            "operation succesfull waiting for the payment invoice uploads",
                        data: { id: fileProcessid },
                    });
                }

                await DatabaseTransaction.transection(async (queryRunner) => {
                    try {
                        for (
                            let i = 0;
                            i < invoiceInsertResp.header.length;
                            i++
                        ) {
                            const csvHeader = viDataVerifier.getVIData[i];
                            const vdsbsGather = new GatherVdsbs(csvHeader);
                            const vdsbsId = await vdsbsGather.gather();
                            if (!vdsbsId) {
                                //NOTE: also at here;
                                return res.status(httpStatus.BAD_REQUEST).json({
                                    message: "vdsbs id not found",
                                });
                            }
                            const valid = await validateIds([vdsbsId]);
                            if (!valid)
                                return res.status(httpStatus.BAD_REQUEST).json({
                                    message: "not found in vdsbs",
                                });
                            //NOTE: another at here;

                            const invoiceEntity = Invoice.create({
                                amount: parseFloat(csvHeader.amount as string),
                                currency: csvHeader.currency,
                                dueDate: csvHeader.due_date,
                                invoiceNo: csvHeader.invoice_no,
                                invoiceDate: csvHeader.invoice_date,
                                refUserList: csvHeader.related_users,
                                ref_intf_id: invoiceInsertResp.header[i].id,
                                has_ps: csvHeader.has_ps,
                                vdsbs_id: vdsbsId,
                                created_by: user,
                                updated_by: user,
                            });

                            const response = (await queryRunner?.manager.insert(
                                Invoice,
                                invoiceEntity
                            )) as InsertResult;

                            const invoice = response.raw[0] as Invoice;
                            const queue: Array<Partial<InvoiceLine>> = [];
                            for (
                                let j = 0;
                                j < invoiceInsertResp.line.length;
                                j++
                            ) {
                                queue.push(
                                    InvoiceLine.create({
                                        currency:
                                            invoiceInsertResp.line[j].currency,
                                        invoice_id: invoice.id,
                                        updated_by: user,
                                        created_by: user,
                                        lineNo: parseInt(
                                            invoiceInsertResp.line[j]
                                                .line_no as string,
                                            10
                                        ),
                                        amount: parseFloat(
                                            invoiceInsertResp.line[j]
                                                .amount as string
                                        ),
                                        itemQuantity: parseInt(
                                            invoiceInsertResp.line[j]
                                                .item_quantity as string,
                                            10
                                        ),
                                        itemUom:
                                            invoiceInsertResp.line[j].item_uom,
                                        itemDescription:
                                            invoiceInsertResp.line[j]
                                                .item_description,
                                    })
                                );
                            }

                            await queryRunner?.manager.save(queue, {
                                chunk: RATE_LIMIT,
                            });

                            const { due_date, line_no } =
                                invoiceInsertResp.header[0];
                            await queryRunner?.manager.save(
                                PaymentSchedule.create({
                                    ...csvHeader,
                                    lineNo: line_no
                                        ? parseInt(line_no, 10)
                                        : undefined,
                                    dueDate: due_date
                                        ? new Date(due_date)
                                        : undefined,
                                    dueAmount: parseFloat(
                                        csvHeader.amount as string
                                    ),
                                    invoice,
                                    updated_by: user,
                                    created_by: user,
                                    vdsbsId,
                                })
                            );

                            const invoiceIntefaces =
                                await invoiceOperation.invoiceInterfaceRepo.find(
                                    {
                                        where: {
                                            invoice_no: csvHeader.invoice_no,
                                            file_status:
                                                FileStatusType.VALIDATED,
                                        },
                                    }
                                );

                            await invoiceOperation.invoiceInterfaceRepo.save(
                                invoiceIntefaces.map((item) => {
                                    return {
                                        ...item,
                                        line_status: LineStatusType.SUCCESS,
                                        file_status: FileStatusType.INVOICED,
                                    };
                                })
                            );
                        }
                        return res.status(httpStatus.CREATED).json({
                            message: "operation succesfull",
                        });
                    } catch (error) {
                        const errorMatcher = new ErrorMatcher(error);
                        const invoiceIntefaces =
                            await invoiceOperation.invoiceInterfaceRepo.find({
                                where: {
                                    file_process_id: fileProcessid,
                                    file_status: FileStatusType.VALIDATED,
                                },
                            });

                        const temp = invoiceIntefaces.map((item) => {
                            return {
                                ...item,
                                line_status: LineStatusType.ERROR,
                                file_status: FileStatusType.REJECTED,
                            };
                        });
                        await invoiceOperation.invoiceInterfaceRepo.save(temp);
                        return errorMatcher.matcher(res);
                    }
                });
            });
        }
    )
);
export default router;
