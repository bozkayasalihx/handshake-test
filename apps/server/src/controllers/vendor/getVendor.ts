import { Request } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";
import { TypedResponse } from "../../types";

interface IGetVendor {
    vendorId?: number;
}

export default async function getVendor(
    req: Request<IGetVendor>,
    res: TypedResponse
) {
    const vendorId = req.params?.vendorId;
    const { user } = req;

    const qb = vendorOperation.repo
        .createQueryBuilder("h")
        .where("h.update_by = :user_id", { user_id: user.id });

    if (vendorId) {
        qb.andWhere("h.id = :hid", { hid: vendorId });
    }

    const vendors = await qb.getMany();

    return res.status(httpStatus.OK).json({
        message: "operation succesful",
        data: vendors,
    });
}
