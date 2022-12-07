import httpStatus from "http-status";
import { vendorOperation } from "../../services";

// eslint-disable-next-line import/no-cycle
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IVendorRegion extends AttributeFields, OptionalDates {
    name: string;
    vendorId: number;
    attribute5?: string;
}

export default async function createVendorRegion(
    req: TypedRequest<IVendorRegion>,
    res: TypedResponse
) {
    const { name, vendorId, ...attributes } = req.body;
    const vendorRegion = vendorOperation.createVendorRegion({
        name,
        ...attributes,
    });
    const { user } = req;

    const vendor = await vendorOperation.repo
        .createQueryBuilder("v")
        .where("v.id = :vendorId", { vendorId })
        .andWhere("v.updated_by = :userId", { userId: user.id })
        .getOne();

    if (!vendor) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid vendor",
        });
    }
    vendorRegion.vendor = vendor;
    vendorRegion.updated_by = user;
    vendorRegion.created_by = user;
    await vendorRegion.save();
    return res.status(httpStatus.OK).json({
        message: "succesfully created ",
    });
}
