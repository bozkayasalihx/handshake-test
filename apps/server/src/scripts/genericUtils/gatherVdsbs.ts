import {
    buyerSiteOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { PickedPSI, PickedVI } from "../parser/dataVerifier";

export class GatherVdsbs {
    private vdsbsOperation = vendorToDealerSiteToBuyerSiteOperation;

    private data: Args<PickedPSI | PickedVI>;

    private BuyerSiteOperation = buyerSiteOperation;

    constructor(args: Args<PickedPSI | PickedVI>) {
        this.data = args;
    }

    public async gather() {
        const buyerSite = await this.BuyerSiteOperation.repo.findOne({
            where: {
                externalBSCode: this.data.external_bs_code,
                externalDSCode: this.data.external_ds_code,
                externalVCode: this.data.external_v_code,
            },
        });

        if (!buyerSite) return null;

        const vdsbs = await this.vdsbsOperation.repo.findOne({
            where: {
                buyerSiteId: buyerSite.id,
            },
            relations: {
                vToDS: {
                    vendor: true,
                    dealerSite: true,
                },
            },
        });

        if (!vdsbs) return null;

        const exVCode = vdsbs.vToDS.vendor.externalVCode;
        const exDSCode = vdsbs.vToDS.dealerSite.externalDSCode;

        if (
            this.data.external_v_code === exVCode &&
            this.data.external_ds_code === exDSCode
        ) {
            return vdsbs.id;
        }

        return null;
    }
}
