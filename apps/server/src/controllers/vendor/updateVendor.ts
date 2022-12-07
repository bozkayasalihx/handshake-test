/* eslint-disable import/no-cycle */
import httpStatus from "http-status";
import { vendorOperation } from "../../services";
import { TypedRequest, TypedResponse } from "../../types";
import { IVendor } from "./createVendor";

export type UpdateVendor = Partial<IVendor> & { id: number };

export default async function updateVendor(
    req: TypedRequest<UpdateVendor>,
    res: TypedResponse
) {
    const { id, name, taxNo, ...attributes } = req.body;
    const { user } = req;

    const vendor = await vendorOperation.repo
        .createQueryBuilder("v")
        .where("v.id = :id", { id })
        .getOne();

    if (!vendor) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "not such as vendor",
        });
    }

    const keys = Object.keys(attributes);
    for (let i = 0; i < keys.length; i++) {
        if (attributes[keys[i]]) vendor[keys[i]] = attributes[keys[i]];
    }
    vendor.updated_by = user;

    await vendor.save();

    return res.status(httpStatus.OK).json({
        message: "successfully updated",
    });
}
