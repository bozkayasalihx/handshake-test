import httpStatus from "http-status";
import {
    Advance,
    Payment,
    PaymentApprovalHeader,
    PaymentMatches,
    PaymentSchedule,
} from "../../models";
import DatabaseTransaction from "../../scripts/transection/databaseTransection";
import {
    advanceOperation,
    paymentApprovalOperation,
    paymentOperation,
} from "../../services";
import {
    AdvanceStatusType,
    InvoicedStatusType,
    PaymentApprovalStatus,
    PaymentStatusType,
    PaymentType,
    TypedRequest,
    TypedResponse,
} from "../../types";
import {
    amountTrackerByPS,
    managePM,
    removedFullyPaidFromPayments,
    removedFullyPaidFromPaymentSchedules,
    sortPaymentSchedules,
    updatePayments,
    updatePS,
} from "./processPayments";

export interface IApprovals {
    vdsbsId: number;
    paymentApprovalId: number;
    type: "H" | "A";
    approved: boolean;
}

async function approvalProcess(
    req: TypedRequest<IApprovals>,
    res: TypedResponse
) {
    const { user } = req;
    const { paymentApprovalId, vdsbsId, approved, type } = req.body;

    if (!approved) {
        type == "H" &&
            (await paymentApprovalOperation.headerRepo
                .createQueryBuilder("ph")
                .where("ph.id = :id", { id: paymentApprovalId })
                .update()
                .set({
                    approvalDate: new Date(Date.now()),
                    approvedById: user.id,
                    status: PaymentApprovalStatus.REJECTED,
                })
                .execute());

        type == "A" &&
            (await advanceOperation.repo
                .createQueryBuilder()
                .where("id = :advanceId", {
                    advanceId: paymentApprovalId,
                })
                .update()
                .set({
                    approvalDate: new Date(Date.now()),
                    approvedById: user.id,
                    status: AdvanceStatusType.REJECTED,
                })
                .execute());

        return res.status(httpStatus.OK).json({
            message: "operation succesfull",
        });
    }

    return await DatabaseTransaction.transection(async (queryRunner) => {
        let approval: PaymentApprovalHeader | Advance | null = null;
        if (type === "H") {
            const appQb = queryRunner.connection
                .getRepository(PaymentApprovalHeader)
                .createQueryBuilder("ph");
            approval = await appQb
                .where("ph.id = :id", {
                    id: paymentApprovalId,
                })
                .leftJoinAndSelect("ph.lines", "lines")
                .getOne();

            if (!approval) {
                return res.status(httpStatus.NOT_FOUND).json({
                    message: "its good",
                });
            }

            const payment = await queryRunner.connection
                .getRepository(Payment)
                .create({
                    created_by: user,
                    updated_by: user,
                    effectiveDate: new Date(Date.now()),
                    originalAmount: approval.amount,
                    remainedAmount: approval.amount,
                    vdsbsId,
                    paymentType: approval.type,
                })
                .save();

            let psList = await queryRunner.connection
                .getRepository(PaymentSchedule)
                .createQueryBuilder("ps")
                .where("ps.vdsbs_id = :id", { id: vdsbsId })
                .andWhere(
                    `ps.payment_status in ('${PaymentStatusType.PARTIALLY_PAID}', '${PaymentStatusType.NO_PAYMENT}')`
                )
                .getMany();

            psList = sortPaymentSchedules(psList);

            let payments = [payment];
            const tempor: Map<string, PaymentMatches> = new Map();
            let i = 0;
            while (true) {
                const result = removedFullyPaidFromPaymentSchedules(psList);

                if (result.length == 0) break;
                const [index, ps] = result[0];

                const conjuctedResult = amountTrackerByPS(
                    removedFullyPaidFromPayments(payments),
                    ps.remainedAmount,
                    (paymentId, amount) => {
                        const key = `${ps.id},${paymentId},${vdsbsId},${amount}`;
                        tempor.set(
                            key,
                            paymentOperation.pmRepo.create({
                                matchedAmount: amount,
                                paymentId: paymentId,
                                paymentScheduleId: ps.id,
                                vdsbsId,
                                created_by: user,
                                updated_by: user,
                            })
                        );
                    }
                );

                await managePM(
                    conjuctedResult,
                    removedFullyPaidFromPayments(payments),
                    queryRunner,
                    ps.id,
                    vdsbsId,
                    user
                );

                payments = updatePayments(
                    removedFullyPaidFromPayments(payments),
                    conjuctedResult
                );

                if (conjuctedResult.partialLeftAmount == 0) {
                    psList = updatePS(psList, i);
                    i++;
                    if (i >= psList.length) break;
                }

                if (conjuctedResult.partialLeftPaymentAmount == 0) {
                    psList[index].remainedAmount =
                        conjuctedResult.partialLeftAmount;
                    psList[index].paymentStatus =
                        PaymentStatusType.PARTIALLY_PAID;
                    i = 0;
                    break;
                }
            }

            await queryRunner.connection
                .getRepository(PaymentSchedule)
                .save(psList);

            await queryRunner.connection.getRepository(Payment).save(payments);

            approval.status = PaymentApprovalStatus.APPROVAL;
            approval.approvalDate = new Date(Date.now());
            approval.approvedById = user.id;

            type == "H" &&
                (await queryRunner.connection
                    .getRepository(PaymentApprovalHeader)
                    .save(approval as PaymentApprovalHeader));
        }

        if (type === "A") {
            const advance = await queryRunner.connection
                .getRepository(Advance)
                .createQueryBuilder("ad")
                .where("ad.id = :id", { id: paymentApprovalId })
                .getOne();

            if (!advance) {
                return res.status(httpStatus.NOT_FOUND).json({
                    message: "not found any advace based on your creteria",
                });
            }

            await queryRunner.connection
                .getRepository(Payment)
                .create({
                    created_by: user,
                    updated_by: user,
                    effectiveDate: new Date(Date.now()),
                    originalAmount: advance.amount,
                    remainedAmount: advance.amount,
                    invoicedStatus: InvoicedStatusType.NO_INVOICE,
                    paymentType: PaymentType.ADVANCE,
                    referece_id: advance.id,
                    vdsbsId,
                })
                .save();

            advance.updated_by = user;
            advance.approvalDate = new Date(Date.now());
            advance.approvedById = user.id;
            advance.status = approved
                ? AdvanceStatusType.APPROVED
                : AdvanceStatusType.REJECTED;

            await advance.save();
        }

        return res.status(httpStatus.OK).json({
            message: "operation successfull",
        });
    }, res);
}

export default approvalProcess;
