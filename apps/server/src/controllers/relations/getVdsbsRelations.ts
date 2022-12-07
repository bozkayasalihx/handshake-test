import { Request, Response } from "express";
import httpStatus from "http-status";
import { BuyerSite, VendorToDealerSite } from "../../models";
import { vendorToDealerSiteToBuyerSiteOperation } from "../../services";

interface IParams {
    vdsbsId: string;
}

export default async function getVdsbsRelations(
    req: Request<IParams>,
    res: Response
) {
    const vdsbsId = req.params.vdsbsId
        ? parseInt(req.params.vdsbsId, 10)
        : undefined;

    const { user } = req;

    const qb = vendorToDealerSiteToBuyerSiteOperation.repo
        .createQueryBuilder("vdsbs")
        .where("vdsbs.updated_by = :id", { id: user.id })
        .leftJoinAndSelect(
            VendorToDealerSite,
            "vds",
            "vds.updated_by = vdsbs.updated_by"
        )
        .leftJoinAndSelect(BuyerSite, "bs", "bs.updated_by = vdsbs.updated_by");

    if (vdsbsId) {
        qb.andWhere("vdsbs.id = :vdsbs_id", { vdsbs_id: vdsbsId });
    }
    const allVdsbs = await qb.getMany();

    return res.status(httpStatus.OK).json({
        message: "operation successful",
        data: allVdsbs,
    });
}
