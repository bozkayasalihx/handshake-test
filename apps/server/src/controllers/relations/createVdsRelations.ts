import httpStatus from "http-status";
import {
    dealerSiteOperation,
    vendorOperation,
    vendorToDealerSiteOperation,
} from "../../services";

// eslint-disable-next-line import/no-cycle
import { OptionalDates, TypedRequest, TypedResponse } from "../../types";

export interface IVdsRelations extends OptionalDates {
    vendorId: number;
    dealerSiteId: number;
    description?: string;
}

export default async function vdsRelations(
    req: TypedRequest<IVdsRelations>,
    res: TypedResponse
) {
    const { dealerSiteId, vendorId, description, ...dates } = req.body;
    const { user } = req;

    const dealerSite = await dealerSiteOperation.repo.findOne({
        where: { id: dealerSiteId },
    });
    if (!dealerSite) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid id",
        });
    }

    const vendor = await vendorOperation.repo.findOne({
        where: { id: vendorId },
    });

    if (!vendor) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid id",
        });
    }

    await vendorToDealerSiteOperation.createVds({
        vendor,
        dealerSiteId,
        ...dates,
        updated_by: user,
        created_by: user,
    });

    return res.status(httpStatus.OK).json({
        message: "operation succesful",
    });
}
