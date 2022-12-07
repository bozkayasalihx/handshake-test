import httpStatus from "http-status";
import { paymentApprovalOperation, paymentOperation } from "../../services";
import {
    InvoicedStatusType,
    InvoiceStatusType,
    PaymentApprovalStatus,
    PaymentStatusType,
    TypedRequest,
    TypedResponse
} from "../../types";

export interface IListAvailablePS {
    vdsbsId: number;
}

async function listInvoices(
    req: TypedRequest<IListAvailablePS>,
    res: TypedResponse
) {
    const { user } = req;
    const { vdsbsId } = req.body;

    const psQb = paymentOperation.psRepo.createQueryBuilder("ps");

    const paymentApprovals: Array<{ ps_id: number }> =
        await paymentApprovalOperation.lineRepo
            .createQueryBuilder("pl")
            .leftJoin("pl.paymentHeader", "ph")
            .where("ph.status = :status", {
                status: PaymentApprovalStatus.PENDING,
            })
            .select("pl.payment_schedule_id", "ps_id")
            .execute();

    psQb.where("ps.vdsbs_id = :vdsbsId", { vdsbsId })
        .andWhere(
            `ps.payment_status in ('${PaymentStatusType.NO_PAYMENT}', '${PaymentStatusType.PARTIALLY_PAID}')`
        )
        .innerJoinAndSelect(
            "ps.invoice",
            "invoice",
            "invoice.status = :status",
            { status: InvoiceStatusType.APPROVED }
        );

    const advanceAmount: [{ sum: number }] =
        await paymentOperation.paymentRepo.query(
            `select sum(remained_amount) from payments where 1=1 and vdsbs_id = ${vdsbsId} and payment_type = 'A' and invoiced_status in ('${InvoicedStatusType.NO_INVOICE}','${InvoicedStatusType.PARTIALLY_PAID}')`
        );
    const depositAmount: [{ sum: number }] =
        await paymentOperation.paymentRepo.query(
            `select sum(remained_amount) from payments where 1=1 and vdsbs_id = ${vdsbsId} and payment_type = 'D' and invoiced_status in ('${InvoicedStatusType.NO_INVOICE}','${InvoicedStatusType.PARTIALLY_PAID}')`
        );

    let p = await psQb.getMany();
    if (paymentApprovals.length) {
        for (let i = 0; i < paymentApprovals.length; i++) {
            const id = paymentApprovals[i].ps_id;
            for (let j = 0; j < p.length; j++) {
                if (id == p[j].id) {
                    p = p.filter((item) => {
                        if (item.id != id) return item;
                        return undefined;
                    });
                }
            }
        }
    }
    return res.status(httpStatus.OK).json({
        message: "operation successfull",
        data: p.length
            ? {
                  totalDeposit: depositAmount[0].sum ? depositAmount[0].sum : 0,
                  advanceTotal: advanceAmount[0].sum ? advanceAmount[0].sum : 0,
                  paymentSchedule: p,
              }
            : {
                  totalDeposit: 0,
                  advanceTotal: 0,
                  paymentSchedule: p,
              },
    });
}
export default listInvoices;
