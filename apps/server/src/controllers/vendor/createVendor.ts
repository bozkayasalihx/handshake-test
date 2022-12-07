import httpStatus from "http-status";
import { vendorOperation } from "../../services";

// eslint-disable-next-line import/no-cycle
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IVendor extends AttributeFields, OptionalDates {
    name: string;
    taxNo: string;
    externalVCode: string;
    attribute5?: string;
}

export default async function createVendor(
    req: TypedRequest<IVendor>,
    res: TypedResponse
) {
    const { externalVCode, name, taxNo, ...attributes } = req.body;
    const { user } = req;

    const vendor = vendorOperation.repo.create({
        externalVCode,
        name,
        taxNo,
        updated_by: user,
        created_by: user,
        ...attributes,
    });

    await vendor.save();

    return res.status(httpStatus.CREATED).json({
        message: "succesfully created",
    });
}
