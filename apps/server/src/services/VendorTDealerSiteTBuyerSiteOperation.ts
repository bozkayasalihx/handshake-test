import VendorToDealerSiteToBuyerSite from "../models/VendorToDealerSiteToBuyerSite";
import BaseService from "./BaseService";

class VendorTDealerSiteTBuyerSite extends BaseService {
    public async createVdsbs(params: Partial<VendorToDealerSiteToBuyerSite>) {
        const vdsbs = VendorToDealerSiteToBuyerSite.create({ ...params });
        return this.repo.insert(vdsbs);
    }

    public get repo() {
        return this.source.getRepository(VendorToDealerSiteToBuyerSite);
    }
}

export default new VendorTDealerSiteTBuyerSite();
