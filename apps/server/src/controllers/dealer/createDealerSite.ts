import httpStatus from "http-status";
import { dealerSiteOperation, vendorOperation } from "../../services";
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IDealerSite extends AttributeFields, OptionalDates {
    name: string;
    dealerId: number;
    externalVCode: string;
    externalDSCode: string;
}

export default async function createDealerSite(
    req: TypedRequest<IDealerSite>,
    res: TypedResponse
) {
    const { dealerId, name, externalVCode, ...attributes } = req.body;
    const { user } = req;

    const vendor = await vendorOperation.repo.findOne({
        where: {
            externalVCode,
        },
    });

    if (!vendor) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "external v code doesn't exits",
        });
    }

    await dealerSiteOperation.insertDealerSite({
        name,
        dealerId,
        externalVCode,
        ...attributes,
        updated_by: user,
        created_by: user,
    });

    return res.status(httpStatus.OK).json({
        message: "successfuly created",
    });
}
