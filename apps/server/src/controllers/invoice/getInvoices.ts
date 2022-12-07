import httpStatus from "http-status";
import { invoiceOperation } from "../../services";
import {
    InvoiceStatusType,
    TypedRequest,
    TypedResponse,
    UserTypes
} from "../../types";

export interface IGetInvoice {
    vdsbs_id: number;
}

async function getInvoicesController(
    req: TypedRequest<IGetInvoice>,
    res: TypedResponse
) {
    const user = req.user;
    const { vdsbs_id } = req.body;

    if (user.userType === UserTypes.DEALER ||
        user.userType === UserTypes.DEALER_ADMIN) {
        const dealerInvoices = await invoiceOperation.invoiceRepo.find({
            where: {
                vdsbs_id,
                status: InvoiceStatusType.NEW,
            },
            relations: {
                invoicesLines: true,
            },
            select: {
                id: true,
                amount: true,
                invoicesLines: {
                    amount: true,
                    id: true,
                    currency: true,
                    itemDescription: true,
                    itemUom: true,
                    itemQuantity: true,
                    lineNo: true,
                },
                status: true,
                invoiceNo: true,
                dueDate: true,
            },
        });

        return res.status(httpStatus.OK).json({
            message: "operation succesfull",
            data: dealerInvoices,
        });
    }
    if (user.userType === UserTypes.BUYER ||
        user.userType === UserTypes.BUYER_ADMIN) {
        const buyerInvoices = await invoiceOperation.invoiceRepo.find({
            where: {
                vdsbs_id,
                status: InvoiceStatusType.PENDING_APPROVAL,
            },
            select: {
                amount: true,
                dueDate: true,
                currency: true,
                id: true,
                has_ps: true,
                invoiceNo: true,
            },
        });

        return res.status(httpStatus.OK).json({
            message: "operation succesfull",
            data: buyerInvoices,
        });
    }

    return res.status(httpStatus.BAD_REQUEST).json({
        message: "that user don't have permission to acess this route",
    });
}

export default getInvoicesController;
