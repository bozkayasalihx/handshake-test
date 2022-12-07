import { doWhat } from "../../controllers/advance/updateAdvance";
import httpStatus from "http-status";
import { Deposit } from "../../models";
import DatabaseTransaction from "../../scripts/transection/databaseTransection";
import { depositOperation, paymentOperation } from "../../services";
import {
    DepositStatusType,
    InvoicedStatusType,
    PaymentType,
    TypedRequest,
    TypedResponse,
} from "../../types";

export type UpdateDepositType = {
    vdsbsId: number;
    isApproved: boolean;
    ids: Array<number>;
};

export const updateDeposit = async (
    req: TypedRequest<UpdateDepositType>,
    res: TypedResponse
) => {
    const { ids, isApproved, vdsbsId } = req.body;

    const user = req.user;

    await DatabaseTransaction.transection(async (qr) => {
        let ds = await depositOperation.repo
            .createQueryBuilder("d")
            .whereInIds(ids)
            .andWhere("d.vdsbs_id = :id", { id: vdsbsId })
            .andWhere("d.status = :status", {
                status: DepositStatusType.PENDING_APPROVAL,
            })
            .getMany();

        ds = doWhat<Deposit, typeof DepositStatusType>(
            ds,
            isApproved,
            user,
            DepositStatusType
        );

        for (let i = ds.length - 1; i >= 0; i--) {
            if (isApproved) {
                ds[i].status = DepositStatusType.APPROVED;
                const payment = paymentOperation.paymentRepo.create({
                    created_by: user,
                    updated_by: user,
                    effectiveDate: new Date(Date.now()),
                    invoicedStatus: InvoicedStatusType.NO_INVOICE,
                    paymentType: PaymentType.DEPOSIT,
                    currency: ds[i].currency,
                    originalAmount: ds[i].amount,
                    remainedAmount: ds[i].amount,
                    referece_id: ds[i].id,
                    vdsbsId,
                });

                await qr.manager.save(ds[i]);
                await qr.manager.save(payment);
            } else {
                ds[i].status = DepositStatusType.REJECTED;
                await qr.manager.save(ds[i]);
            }
        }

        return res.status(httpStatus.OK).json({
            message: "operation sucessfull",
        });
    }, res);
};

export default updateDeposit;
