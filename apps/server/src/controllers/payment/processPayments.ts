import httpStatus from "http-status";
import { QueryRunner } from "typeorm";
import {
    Payment,
    PaymentApprovalHeader,
    PaymentMatches,
    PaymentSchedule,
    User,
} from "../../models";
import PaymentApprovalLines from "../../models/PaymentApprovalLine";
import bankOperations from "../../scripts/banks/bankOperations";
import DatabaseTransaction from "../../scripts/transection/databaseTransection";
import { paymentOperation } from "../../services";
import {
    InvoicedStatusType,
    PaymentStatusType,
    PaymentType,
    TypedRequest,
    TypedResponse,
    UserTypes,
} from "../../types";

export interface IProcessPayment {
    vdsbsId: number;
    totalDeposit: number;
    totalAdvance: number;
    paymentType: PaymentType;
    amountToPay: number;
    psIds: Array<number>;
}

type AmountTrackerType = {
    full: number;
    partial: number;
    partialLeftAmount: number;
    partialLeftPaymentAmount: number;
};

function mapToArray(data: Map<string, any>) {
    return Array.from(data).map(([key, value]) => value);
}

function sortPayments(payments: Payment[]) {
    const sorted = payments.sort((a, b) => {
        if (a.effectiveDate.getTime() === b.effectiveDate.getTime()) {
            return 0;
        }
        if (a.effectiveDate.getTime() > b.effectiveDate.getTime()) {
            return 1;
        }
        return -1;
    });
    return sorted;
}

export function sortPaymentSchedules(payments: PaymentSchedule[]) {
    const sorted = payments.sort((a, b) => {
        if (new Date(a.dueDate).getTime() === new Date(b.dueDate).getTime()) {
            return 0;
        }
        if (new Date(a.dueDate).getTime() > new Date(b.dueDate).getTime()) {
            return 1;
        }
        return -1;
    });
    return sorted;
}

export function removedFullyPaidFromPayments(data: Payment[]) {
    const temp: Payment[] = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].invoicedStatus !== InvoicedStatusType.FULLY_PAID) {
            temp.push(data[i]);
        }
    }

    return temp;
}

function removedFullyPaidFromPaymentsByIds(data: Payment[]) {
    let t: number[] = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].invoicedStatus !== InvoicedStatusType.FULLY_PAID) {
            t.push(i);
        }
    }
    return t;
}

export function removedFullyPaidFromPaymentSchedules(data: PaymentSchedule[]) {
    const temp: Array<[number, PaymentSchedule]> = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].paymentStatus !== PaymentStatusType.FULLY_PAID) {
            temp.push([i, data[i]]);
        }
    }

    return temp;
}

function totalSum(data: Payment[] | PaymentSchedule[], startindex = 0) {
    let sum = 0;
    for (let i = startindex; i < data.length; i++) {
        sum += data[i].remainedAmount;
    }
    return sum;
}

export async function managePM(
    { full, partial, partialLeftPaymentAmount }: AmountTrackerType,
    data: Payment[],
    queryRunner: QueryRunner,
    psId: number,
    vdsbsId: number,
    user: User
) {
    if (full !== -1) {
        for (let i = 0; i <= full; i++) {
            await queryRunner.connection.getRepository(PaymentMatches).save({
                matchedAmount: data[i].remainedAmount,
                paymentId: data[i].id,
                paymentScheduleId: psId,
                vdsbsId,
                created_by: user,
                updated_by: user,
            });
        }
    }

    if (partial != -1) {
        await queryRunner.connection.getRepository(PaymentMatches).save({
            matchedAmount:
                data[partial].remainedAmount - partialLeftPaymentAmount,
            paymentId: data[partial].id,
            paymentScheduleId: psId,
            vdsbsId,
            created_by: user,
            updated_by: user,
        });
    }
}
export function amountTrackerByPS(
    data: Payment[],
    amountToPay: number,
    cb?: (paymentId: number, amount: number) => void,
    limit = 0
): {
    full: number;
    partial: number;
    partialLeftAmount: number;
    partialLeftPaymentAmount: number;
} {
    let total = 0;
    let allSum = totalSum(data);

    if (allSum < amountToPay) {
        for (let j = 0; j < data.length; j++) {
            // cb && cb(data[j].id, data[j].remainedAmount);
        }
        return {
            full: data.length - 1,
            partial: -1,
            partialLeftAmount: amountToPay - allSum,
            partialLeftPaymentAmount: 0,
        };
    }

    for (let i = 0; i <= limit; i++) {
        const whoWillGo =
            data[i].remainedAmount > amountToPay
                ? amountToPay
                : data[i].remainedAmount;

        total += data[i].remainedAmount;
    }

    if (total >= amountToPay) {
        if (total == amountToPay) {
            return {
                full: limit,
                partial: -1,
                partialLeftAmount: 0,
                partialLeftPaymentAmount: 0,
            };
        }
        return {
            full: limit - 1,
            partial: limit,
            partialLeftAmount: 0,
            partialLeftPaymentAmount: total - amountToPay,
        };
    }
    limit++;
    return amountTrackerByPS(data, amountToPay, cb, limit);
}

export function updatePS(data: PaymentSchedule[], index: number) {
    data[index].paymentStatus = PaymentStatusType.FULLY_PAID;
    data[index].remainedAmount = 0;
    return data;
}
export function updatePayments(
    data: Payment[],
    { full, partial, partialLeftPaymentAmount }: AmountTrackerType
) {
    //note: update the payments;
    for (let i = 0; i <= full; i++) {
        data[i].invoicedStatus = InvoicedStatusType.FULLY_PAID;
        data[i].remainedAmount = 0;
    }

    if (partial != -1) {
        data[partial].invoicedStatus = InvoicedStatusType.PARTIALLY_PAID;
        data[partial].remainedAmount = partialLeftPaymentAmount;
    }

    return data;
}

async function innerApproval(
    queryRunner: QueryRunner,
    type: UserTypes,
    amountToPay: number,
    vdsbsId: number,
    psList: PaymentSchedule[],
    user: User,
    paymentType: PaymentType
) {
    const ph = await queryRunner.connection
        .getRepository(PaymentApprovalHeader)
        .create({
            amount: amountToPay,
            senderUserType: type,
            vdsbsId,
            created_by: user,
            updated_by: user,
            type: paymentType,
        })
        .save();

    const paymentApprovalLine =
        queryRunner.connection.getRepository(PaymentApprovalLines);
    for (let i = 0; i < psList.length; i++) {
        await paymentApprovalLine
            .create({
                paymentApprovalHeaderId: ph.id,
                paymentScheduleId: psList[i].id,
                paymentHeader: ph,
                created_by: user,
                updated_by: user,
            })
            .save();
    }
}

export default async function processPayments(
    req: TypedRequest<IProcessPayment>,
    res: TypedResponse
) {
    const user = req.user;
    const { psIds, paymentType, vdsbsId, totalAdvance, totalDeposit } =
        req.body;

    let amountToPay = req.body.amountToPay;

    let psList = await paymentOperation.psRepo
        .createQueryBuilder("ps")
        .whereInIds(psIds)
        .getMany();

    psList = sortPaymentSchedules(psList);

    const cashPayment = paymentType == PaymentType.CASH;
    const dealerRelated =
        user.userType == UserTypes.DEALER ||
        user.userType == UserTypes.DEALER_ADMIN;
    const buyerRelated =
        user.userType == UserTypes.BUYER ||
        user.userType == UserTypes.BUYER_ADMIN;

    return await DatabaseTransaction.transection(async (queryRunner) => {
        await queryRunner.startTransaction();

        let itsDepositsAndAdvances = await paymentOperation.paymentRepo
            .createQueryBuilder("p")
            .where("p.vdsbs_id = :id", { id: vdsbsId })
            .andWhere(
                `p.payment_type in ('${PaymentType.ADVANCE}', '${PaymentType.DEPOSIT}')`
            )
            .andWhere(
                `p.invoiced_status not in ('${InvoicedStatusType.FULLY_PAID}')`
            )
            .getMany();

        itsDepositsAndAdvances = sortPayments(itsDepositsAndAdvances);

        let i = 0;
        let curPs = psList[0];
        let remainedAmount = 0;
        const temp: Map<string, PaymentMatches> = new Map();
        while (true) {
            const conjuctedResult = amountTrackerByPS(
                removedFullyPaidFromPayments(itsDepositsAndAdvances),
                curPs.remainedAmount,
                (paymentId, amount) => {
                    const key = `${curPs.id},${paymentId},${vdsbsId},${amount}`;
                    temp.set(
                        key,
                        paymentOperation.pmRepo.create({
                            matchedAmount: amount,
                            paymentId: paymentId,
                            paymentScheduleId: curPs.id,
                            vdsbsId,
                            created_by: user,
                            updated_by: user,
                        })
                    );
                }
            );

            curPs.paymentStatus = PaymentStatusType.PARTIALLY_PAID;

            await managePM(
                conjuctedResult,
                removedFullyPaidFromPayments(itsDepositsAndAdvances),
                queryRunner,
                curPs.id,
                vdsbsId,
                user
            );

            const rt = removedFullyPaidFromPaymentsByIds(
                itsDepositsAndAdvances
            );
            let j: Payment[] = [];
            for (let m = 0; m < rt.length; m++) {
                j.push(itsDepositsAndAdvances[rt[m]]);
            }

            j = updatePayments(j, conjuctedResult);

            for (let z = 0; z < rt.length; z++) {
                itsDepositsAndAdvances[rt[z]] = j[z];
            }

            if (conjuctedResult.partialLeftAmount == 0) {
                psList = updatePS(psList, i);
                i++;
                if (i >= psList.length) break;
                curPs = psList[i];
            }

            if (conjuctedResult.partialLeftPaymentAmount == 0) {
                psList[i].remainedAmount = conjuctedResult.partialLeftAmount;
                remainedAmount += totalSum(psList);
                i = 0;
                break;
            }
        }

        if (amountToPay > remainedAmount) {
            await queryRunner.rollbackTransaction();
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "can't be bigger than remained amount",
            });
        }

        await queryRunner.connection
            .getRepository(PaymentSchedule)
            .save(psList);

        await queryRunner.connection
            .getRepository(Payment)
            .save(itsDepositsAndAdvances);

        if (amountToPay == 0) {
            return res.status(httpStatus.OK).json({
                message: "operation successfull",
            });
        }

        if (dealerRelated) {
            await innerApproval(
                queryRunner,
                user.userType,
                amountToPay,
                vdsbsId,
                psList,
                user,
                paymentType
            );
            return res.status(httpStatus.OK).json({
                message: "operation successfull",
            });
        }
        if (cashPayment) {
            //@ts-ignore
            let ph: PaymentApprovalHeader = null;
            if (amountToPay !== 0) {
                ph = await queryRunner.connection
                    .getRepository(PaymentApprovalHeader)
                    .create({
                        amount: amountToPay,
                        senderUserType: user.userType,
                        type: PaymentType.CASH,
                        vdsbsId,
                        created_by: user,
                        updated_by: user,
                    })
                    .save();
            }
            while (true) {
                const result = removedFullyPaidFromPaymentSchedules(psList);
                if (result.length == 0 || amountToPay == 0) break;
                const [index, ps] = result[0];

                ph &&
                    (await queryRunner.connection
                        .getRepository(PaymentApprovalLines)
                        .create({
                            paymentApprovalHeaderId: ph.id,
                            paymentScheduleId: ps.id,
                            paymentHeader: ph,
                            created_by: user,
                            updated_by: user,
                        })
                        .save());

                if (psList[index].remainedAmount >= amountToPay) {
                    if (psList[index].remainedAmount == amountToPay) {
                        psList[index].paymentStatus =
                            PaymentStatusType.FULLY_PAID;
                    } else {
                        psList[index].paymentStatus =
                            PaymentStatusType.PARTIALLY_PAID;
                    }
                    psList[index].remainedAmount -= amountToPay;
                    amountToPay = 0;
                } else {
                    psList[index].remainedAmount =
                        psList[index].remainedAmount - amountToPay;
                    psList[index].paymentStatus = PaymentStatusType.FULLY_PAID;
                    amountToPay -= psList[index].remainedAmount;
                }
            }

            return res.status(httpStatus.OK).json({
                message: "operation succesfull",
            });
        }

        const bankResult = bankOperations.done(amountToPay);

        if (bankResult) {
            const p = await queryRunner.connection
                .getRepository(Payment)
                .create({
                    created_by: user,
                    updated_by: user,
                    effectiveDate: new Date(Date.now()),
                    originalAmount: amountToPay,
                    remainedAmount: amountToPay,
                    vdsbsId,
                    paymentType: paymentType,
                })
                .save();

            let payments = [p];
            const tempor: Map<string, PaymentMatches> = new Map();
            while (true) {
                const result = removedFullyPaidFromPaymentSchedules(psList);

                if (result.length == 0 || amountToPay == 0) break;
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
                    curPs = psList[i];
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

            await queryRunner.connection.getRepository(Payment).save(payments);
            await queryRunner.connection
                .getRepository(PaymentSchedule)
                .save(psList);

            return res.status(httpStatus.OK).json({
                message: "operation succesfull",
            });
        }

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return res.status(httpStatus.OK).json({
            message: "operation succesfull",
        });
    }, res);
}
