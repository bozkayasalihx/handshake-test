import httpStatus from "http-status";
import dealerOperation from "../../services/dealerOperation";
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IDealer extends AttributeFields, OptionalDates {
    name: string;
    taxNo: number;
}

export default async function dealer(
    req: TypedRequest<IDealer>,
    res: TypedResponse
) {
    const { name, taxNo, ...attributes } = req.body;
    const { user } = req;
    await dealerOperation.insertDealer({
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
