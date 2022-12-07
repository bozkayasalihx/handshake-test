import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorToDealerSiteOperation } from "../../services";

interface Iparams {
    vdsId?: string;
}
export default async function getVdsRelations(
    req: Request<Iparams>,
    res: Response
) {
    const vdsId = req.params.vdsId ? parseInt(req.params.vdsId, 10) : undefined;

    try {
        if (typeof vdsId === "number") {
            const vds = await vendorToDealerSiteOperation.repo.findOne({
                where: { id: vdsId },
                relations: {
                    dealerSite: true,
                    vendor: true,
                },
            });

            if (!vds) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "invalid request",
                });
            }

            return res.status(httpStatus.OK).json({
                message: "operation successful",
                data: {
                    vds,
                },
            });
        }

        const maker = await vendorToDealerSiteOperation.repo.find({
            relations: {
                dealerSite: true,
                vendor: true,
            },
        });

        return res.status(httpStatus.OK).json({
            message: "operation successful",
            data: maker,
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
