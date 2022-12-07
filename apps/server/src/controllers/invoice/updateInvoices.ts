import httpStatus from "http-status";
import { invoiceOperation } from "../../services";
import {
    InvoiceStatusType,
    TypedRequest,
    TypedResponse,
    UserTypes,
} from "../../types";

export interface IUpdateInvoice {
    invoice: Array<{ invoice_id: number }>;
    proven_type: InvoiceStatusType;
}

async function updateInvoiceControler(
    req: TypedRequest<IUpdateInvoice>,
    res: TypedResponse
) {
    const user = req.user;

    const { invoice, proven_type } = req.body;

    const letIds: Array<number> = [];
    for (let i = 0; i < invoice.length; i++) {
        letIds.push(invoice[i].invoice_id);
    }

    const invoicesQb = invoiceOperation.invoiceRepo
        .createQueryBuilder("i")
        .whereInIds(letIds);

    if (
        user.userType == UserTypes.DEALER ||
        user.userType == UserTypes.DEALER_ADMIN
    ) {
        invoicesQb.andWhere("i.status = :status", {
            status: InvoiceStatusType.NEW,
        });
        const types = [InvoiceStatusType.PENDING_APPROVAL, InvoiceStatusType.CANCELLED];
        let valid = false;
        for (let i = 0; i < types.length; i++) {
            if (types[i] == proven_type) valid = true;
        }
        if (!valid) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this user type doesn't have this permission type",
            });
        }
    }

    if (
        user.userType == UserTypes.BUYER ||
        user.userType == UserTypes.BUYER_ADMIN
    ) {
        invoicesQb.andWhere("i.status = :status", {
            status: InvoiceStatusType.PENDING_APPROVAL,
        });

        const types = [InvoiceStatusType.APPROVED, InvoiceStatusType.REJECTED];
        let valid = false;
        for (let i = 0; i < types.length; i++) {
            if (types[i] == proven_type) valid = true;
        }
        if (!valid) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this user type doesn't have this permission type",
            });
        }
    }

    const t = (await invoicesQb.getMany()).map((inv) => {
        inv.status = proven_type;
        return inv;
    });

    await invoiceOperation.invoiceRepo.save(t);
    return res.status(httpStatus.OK).json({
        message: "operation succesfull",
    });
}

export default updateInvoiceControler;
