import httpStatus from "http-status";
import { vendorToDealerSiteToBuyerSiteOperation } from "../../services";
// eslint-disable-next-line import/no-cycle
import { OptionalDates, TypedRequest, TypedResponse } from "../../types";

export interface IVDSBSRelations extends OptionalDates {
    vdsRltnId: number;
    buyerSiteId: number;
    description: string;
}

export default async function vdsbsRelationsController(
    req: TypedRequest<IVDSBSRelations>,
    res: TypedResponse
) {
    const { buyerSiteId, description, vdsRltnId, ...dates } = req.body;

    const vdsbs = vendorToDealerSiteToBuyerSiteOperation.repo.create({
        vds_rltn_id: vdsRltnId,
        buyerSiteId: buyerSiteId,
        ...dates,
        updated_by: req.user,
        created_by: req.user,
    });

    await vdsbs.save();

    return res.status(httpStatus.CREATED).json({
        message: "successful operation",
    });
}
