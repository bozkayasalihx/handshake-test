import httpStatus from "http-status";
import { buyerOperation } from "../../services";
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IBuyer extends AttributeFields, OptionalDates {
    name: string;
    taxNo: number;
}

export default async function buyer(
    req: TypedRequest<IBuyer>,
    res: TypedResponse
) {
    const { name, taxNo, ...attributes } = req.body;
    const { user } = req;

    await buyerOperation.insertBuyer({
        name,
        taxNo: String(taxNo),
        ...attributes,
        updated_by: user,
        created_by: user,
    });

    return res.status(httpStatus.OK).json({
        message: "successfully created",
    });
}
