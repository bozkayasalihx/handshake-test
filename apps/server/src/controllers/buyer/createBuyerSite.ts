import httpStatus from "http-status";
import {
    buyerSiteOperation,
    dealerSiteOperation,
    vendorOperation,
} from "../../services";
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IBuyerSite extends AttributeFields, OptionalDates {
    name: string;
    buyerId: number;
    externalVCode: string;
    externalDSCode: string;
    externalBSCode: string;
}

export default async function buyerSite(
    req: TypedRequest<IBuyerSite>,
    res: TypedResponse
) {
    const { buyerId, name, externalDSCode, ...attributes } = req.body;
    const { user } = req;
    const buyerSiteUser = await buyerSiteOperation.repo.findOne({
        where: { name },
    });

    const dealerSite = await dealerSiteOperation.repo.findOne({
        where: {
            externalDSCode,
        },
    });

    if (!dealerSite) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "external ds code doesnt exits",
        });
    }

    const vendor = await vendorOperation.repo.findOne({
        where: {
            externalVCode: attributes.externalVCode,
        },
    });

    if (!vendor) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "external v code not found",
        });
    }

    if (buyerSiteUser) {
        buyerSiteUser.buyer_id = buyerId;
        buyerSiteUser.created_by = user;
        buyerSiteUser.updated_by = user;
        buyerSiteUser.externalDSCode = externalDSCode;
        buyerSiteUser.externalVCode = attributes.externalVCode;
        buyerSiteUser.externalBSCode = attributes.externalBSCode;
        await buyerSiteUser.save();
        return res.status(httpStatus.OK).json({
            message: "succesfully updated",
        });
    }

    await buyerSiteOperation.insertBuyerSite({
        name,
        buyer_id: buyerId,
        externalDSCode,
        ...attributes,
        updated_by: user,
        created_by: user,
    });

    return res.status(httpStatus.OK).json({
        message: "succesfully created",
    });
}
