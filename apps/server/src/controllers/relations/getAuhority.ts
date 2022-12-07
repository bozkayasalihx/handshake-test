import httpStatus from "http-status";
import formater from "../../scripts/formater";
import {
    userOperation,
    userVdsbsAccess,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { TypedRequest, TypedResponse, UserTypes } from "../../types";

interface HasVdsbsAccess {
    userId: number;
}

export default async function getHasVdsbsAccess(
    req: TypedRequest<HasVdsbsAccess>,
    res: TypedResponse
) {
    const { userId } = req.body;

    const user = await userOperation.repo.findOne({ where: { id: userId } });
    if (!user)
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "user not found",
        });

    let result: any = [];
    if (user.userType === UserTypes.SITE_ADMIN) {
        const allrecords =
            await vendorToDealerSiteToBuyerSiteOperation.repo.find({
                relations: {
                    buyerSite: {
                        buyer: true,
                    },
                    vToDS: {
                        dealerSite: {
                            dealer: true,
                        },
                        vendor: true,
                    },
                },
            });

        result = formater.advanceTransformer(allrecords);
    } else {
        userVdsbsAccess.setUserId = userId;

        const whichType = {
            name: true,
            id: true,
            externalVCode: true,
            exteranlDSCode: true,
            externalBSCode: true,
        };

        const t = await userVdsbsAccess.tableRouter(true, false);
        const r = await t.reformater();

        result = r;
    }

    return res.status(httpStatus.OK).json({
        message: "operation succesfull",
        data: result,
    });
}
