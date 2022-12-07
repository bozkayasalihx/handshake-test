import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import httpStatus from "http-status";
import { checkFileType } from "../../middlewares";
import errorHandler from "../../middlewares/errorHandler";
import {
    Invoice,
    InvoiceInterface,
    InvoiceLine,
    PaymentSchedule,
    PaymentScheduleInterface,
} from "../../models";
import { __prod__ } from "../../scripts/dev";
import { SuperGenerate } from "../../scripts/generator/eventGenerate";
import { GatherVdsbs } from "../../scripts/genericUtils/gatherVdsbs";
import { OmmitedPaymentSchedule } from "../../scripts/genericUtils/type";
import GroupBY, { GenKeys } from "../../scripts/groupBy";
import UniqueObject from "../../scripts/object/uniqueObject";
import CsvParser from "../../scripts/parser/csvParser";
import DataVerifier, {
    PSIVerifierType,
} from "../../scripts/parser/dataVerifier";
import { GenerateCsv } from "../../scripts/parser/generateCsv";
import DatabaseTransaction from "../../scripts/transection/databaseTransection";
import ErrorMatcher from "../../scripts/utils/errorMatcher";
import { isSame } from "../../scripts/utils/isSame";
import { increment } from "../../scripts/utils/revokeRefreshToken";
import { unique } from "../../scripts/utils/unique";
import { invoiceOperation, paymentOperation } from "../../services";
import {
    FileRecordType,
    FileStatusType,
    HasPs,
    LineStatusType,
    TypedRequest,
    TypedResponse,
} from "../../types";
import { Routes } from "../../types/routePath";

const INVALID_INDEX = -1;

const router = Router();
const fileRoute = () =>
    fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        debug: !__prod__,
    });

async function psiSaveHelper(id: string) {
    const paymentSIs = await paymentOperation.PSIRepo.find({
        where: {
            file_process_id: parseInt(id, 10),
            file_status: FileStatusType.VALIDATED,
        },
    });

    const psiContainer = paymentSIs.map((item) => {
        return {
            ...item,
            file_status: FileStatusType.REJECTED,
            line_status: LineStatusType.ERROR,
        };
    });

    await paymentOperation.PSIRepo.save(psiContainer);
}

const DELIMITER = ";";

router.post(
    Routes.PROCESS_PS_UPLOAD,
    fileRoute(),
    checkFileType,
    errorHandler.handleWithAuth(
        async (req: TypedRequest<any, { id: string }>, res: TypedResponse) => {
            const file = req.files?.file as UploadedFile;

            const fileName = file.name;
            const { user } = req;
            const { id } = req.query;

            const fileProcessId = await increment("ps_file_process_id");

            const parser = new CsvParser<PaymentScheduleInterface>(DELIMITER);

            parser.readData(file.data.toString());
            // @ts-ignore
            parser.matcher(async (err, parsedData) => {
                if (err || !parsedData || !parsedData.size) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: err?.message ? err.message : "bad request",
                    });
                }

                const psiDataVerifier = new DataVerifier("psi");
                psiDataVerifier.setPSIData(Array.from(parsedData));
                psiDataVerifier.validate();

                if (psiDataVerifier.errors.size) {
                    const generateCsv =
                        new GenerateCsv<PaymentScheduleInterface>(
                            psiDataVerifier.errors,
                            psiDataVerifier.getPSIData as any
                        );
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message:
                            "invalid column type detected please fix those type and try again",
                    });
                }

                if (!psiDataVerifier.getPSIData.length) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: "malformed request",
                    });
                }

                const superGen = new SuperGenerate<PaymentScheduleInterface>(
                    psiDataVerifier.getPSIData as any,
                    "gen_csv",
                    fileName
                );

                const psiGroupedArray = new GroupBY<
                    typeof psiDataVerifier.getPSIData
                >()
                    .readData(psiDataVerifier.getPSIData)
                    .group();

                const psiSectionChecked = psiGroupedArray.sectionChecker();
                if (psiSectionChecked.size >= 1) {
                    let errorMsg =
                        "external_v_code or external_bs_code or external_ds_code must match with each other";
                    psiSectionChecked.forEach((columnName, index) => {
                        superGen.emit(
                            "gen_csv",
                            new Map().set(
                                psiDataVerifier.genKeys(
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

                const insertedPSIResp: Array<Args<OmmitedPaymentSchedule>> = [];
                const insertQueue: Array<Promise<PaymentScheduleInterface>> =
                    [];

                for (const record of parsedData) {
                    insertQueue.push(
                        PaymentScheduleInterface.create({
                            ...record,
                            file_name: fileName,
                            file_process_id: fileProcessId,
                            created_by: user,
                            updated_by: user,
                        }).save()
                    );
                }
                const temp = await Promise.all(insertQueue);

                for (let i = 0; i < temp.length; i++) {
                    const {
                        created_by: _1,
                        updated_by: _2,
                        created_at: _3,
                        updated_at: _4,
                        ...args
                    } = temp[i];
                    insertedPSIResp.push(args);
                }

                await DatabaseTransaction.transection(async (queryRunner) => {
                    try {
                        const invoiceInfs =
                            await invoiceOperation.invoiceInterfaceRepo.find({
                                where: {
                                    file_process_id: parseInt(id, 10),
                                    record_type: FileRecordType.HEADER,
                                },
                            });

                        if (!invoiceInfs.length) {
                            await psiSaveHelper(String(fileProcessId));
                            return res.status(httpStatus.BAD_REQUEST).json({
                                message: "invoice interfaces not found",
                            });
                        }

                        const same = isSame(
                            invoiceInfs
                                //@ts-ignore
                                .filter((item) => {
                                    if (item.has_ps === HasPs.YES) {
                                        return item;
                                    }
                                })
                                .map((item) => item.invoice_no),
                            unique(
                                insertedPSIResp.map((item) => item.invoice_no)
                            )
                        );

                        if (!same) {
                            await psiSaveHelper(String(fileProcessId));
                            return res.status(httpStatus.BAD_REQUEST).json({
                                message:
                                    "invoice no's doesnt match that you proviosuly uploaded",
                            });
                        }

                        //NOTE: LEFT AT HERE;
                        const psiArrayData =
                            psiGroupedArray.getFirstElementOfMap();

                        const uniqueIndex = new UniqueObject<
                            typeof psiArrayData,
                            typeof invoiceInfs
                        >()
                            .readData(psiArrayData, invoiceInfs)
                            .isUnique([
                                "external_v_code",
                                "external_ds_code",
                                "external_bs_code",
                            ]);

                        if (uniqueIndex > INVALID_INDEX) {
                            const errorMsg =
                                "external_v_code or external_ds_code or external_bs_code must match that you were previously uploaded! please check and try again";
                            superGen.emit(
                                "gen_csv",
                                new Map().set(
                                    psiDataVerifier.genKeys(
                                        uniqueIndex,
                                        "external_ds_code"
                                    ),
                                    errorMsg
                                )
                            );

                            await psiSaveHelper(String(fileProcessId));
                            return res.status(httpStatus.BAD_REQUEST).json({
                                message: errorMsg,
                            });
                        }

                        const groupedInvoiceInterfaces = new GroupBY<
                            Array<InvoiceInterface>
                        >()
                            .readData(invoiceInfs)
                            .group();

                        const validateMap = psiDataVerifier.validatePSIAmount(
                            psiGroupedArray.map
                        );

                        let validateAmount: Map<string, number> = new Map();
                        for (let [key, value] of groupedInvoiceInterfaces.map) {
                            if (validateMap.has(key)) {
                                const val = value[1];
                                const [index, amount] = validateMap.get(
                                    key
                                ) as [number, string];
                                if (amount !== val[0].amount) {
                                    validateAmount.set(key, index);
                                }
                            }
                        }
                        if (validateAmount.size) {
                            validateAmount.forEach((index) => {
                                superGen.emit(
                                    "gen_csv",
                                    new Map().set(
                                        psiDataVerifier.genKeys(
                                            index,
                                            "amount"
                                        ),
                                        `this line's payment schedule total amount  must match with its invoice amount`
                                    )
                                );
                            });

                            return res.status(httpStatus.BAD_REQUEST).json({
                                message:
                                    "payment schedule total amount  must match with its invoice amount",
                            });
                        }
                        const queue: Array<PaymentSchedule> = [];
                        let invoiceInterfaceLines: InvoiceInterface[] = [];

                        for (let j = 0; j < invoiceInfs.length; j++) {
                            const intfs = invoiceInfs[j];

                            const vdsbsGather = new GatherVdsbs(intfs);
                            const vdsbsId =
                                (await vdsbsGather.gather()) as number;

                            const invoice = Invoice.create({
                                amount: parseFloat(intfs.amount as string),
                                currency: intfs.currency,
                                dueDate: intfs.due_date,
                                invoiceNo: intfs.invoice_no,
                                has_ps: intfs.has_ps,
                                invoiceDate: intfs.invoice_date,
                                refUserList: intfs.related_users,
                                ref_intf_id: intfs.id,
                                vdsbs_id: vdsbsId,
                                created_by: user,
                                updated_by: user,
                            });
                            invoiceInterfaceLines =
                                await invoiceOperation.invoiceInterfaceRepo.find(
                                    {
                                        where: {
                                            invoice_no: invoice.invoiceNo,
                                            record_type: FileRecordType.LINE,
                                            file_process_id: parseInt(id),
                                        },
                                    }
                                );

                            await queryRunner.manager.save(Invoice, invoice);

                            const lineTemp: InvoiceLine[] = [];
                            for (const line of invoiceInterfaceLines) {
                                lineTemp.push(
                                    InvoiceLine.create({
                                        lineNo: line.line_no
                                            ? parseInt(
                                                  line.line_no as string,
                                                  10
                                              )
                                            : undefined,
                                        amount: parseInt(line.amount, 10),
                                        currency: line.currency,
                                        itemDescription: line.item_description,
                                        itemQuantity: line.item_quantity
                                            ? parseInt(line.item_quantity, 10)
                                            : undefined,
                                        itemUom: line.item_uom,
                                        invoice_id: invoice.id,
                                        created_by: user,
                                        updated_by: user,
                                    })
                                );
                            }

                            await queryRunner.manager.save(
                                InvoiceLine,
                                lineTemp
                            );

                            if (intfs.has_ps === HasPs.NO) {
                                queue.push(
                                    PaymentSchedule.create({
                                        currency: intfs.currency as string,
                                        dueDate: intfs.due_date
                                            ? new Date(intfs.due_date)
                                            : undefined,
                                        invoice,
                                        dueAmount: parseFloat(
                                            (intfs.amount as string) || "0"
                                        ),
                                        remainedAmount: parseFloat(
                                            (intfs.amount as string) || "0"
                                        ),
                                        lineNo: parseInt(
                                            (intfs.line_no || 1) as string,
                                            10
                                        ),
                                        vdsbsId,
                                        created_by: user,
                                        updated_by: user,
                                    })
                                );
                            }

                            if (intfs.has_ps === HasPs.YES) {
                                const key = new GenKeys().genMapKeys(intfs);
                                const arr = psiGroupedArray.map.get(
                                    key
                                )?.[1] as PSIVerifierType;

                                for (let i = 0; i < arr.length; i++) {
                                    queue.push(
                                        PaymentSchedule.create({
                                            currency: arr[i].currency as string,
                                            dueDate: arr[i].due_date
                                                ? new Date(
                                                      arr[i].due_date as string
                                                  )
                                                : undefined,
                                            invoice,
                                            dueAmount: parseFloat(
                                                (arr[i].amount as string) || "0"
                                            ),

                                            remainedAmount: parseFloat(
                                                (arr[i].amount as string) || "0"
                                            ),
                                            lineNo: parseInt(
                                                (arr[i].line_no || 1) as string,
                                                10
                                            ),
                                            vdsbsId,
                                            created_by: user,
                                            updated_by: user,
                                        })
                                    );
                                }
                            }
                        }

                        await queryRunner.manager.save(queue);

                        const paymentSI = await paymentOperation.PSIRepo.find({
                            where: {
                                file_process_id: fileProcessId,
                                file_status: FileStatusType.VALIDATED,
                            },
                        });

                        for (let i = 0; i < paymentSI.length; i++) {
                            paymentSI[i].file_status = FileStatusType.INVOICED;
                            paymentSI[i].line_status = LineStatusType.SUCCESS;
                        }

                        const invoiceMerge =
                            await invoiceOperation.invoiceInterfaceRepo.find({
                                where: {
                                    file_process_id: parseInt(id, 10),
                                    file_status: FileStatusType.VALIDATED,
                                },
                            });

                        for (let j = 0; j < invoiceMerge.length; j++) {
                            invoiceMerge[j].file_status =
                                FileStatusType.INVOICED;
                            invoiceMerge[j].line_status =
                                LineStatusType.SUCCESS;
                        }

                        await paymentOperation.PSIRepo.save(paymentSI);
                        await queryRunner.manager.save(
                            InvoiceInterface,
                            invoiceMerge
                        );

                        return res.status(httpStatus.OK).json({
                            message: "operation succesful",
                        });
                    } catch (error) {
                        const errorMatcher = new ErrorMatcher(error);
                        await psiSaveHelper(String(fileProcessId));
                        return errorMatcher.matcher(res);
                    }
                });
            });
        }
    )
);

export default router;
