import { VendorToDealerSite } from "../models";
import BaseService from "./BaseService";

class VendorTDealerSiteOperation extends BaseService {
    public async createVds(params: Partial<VendorToDealerSite>) {
        const vds = VendorToDealerSite.create({ ...params });
        return this.repo.insert(vds);
    }

    public get repo() {
        return this.source.getRepository(VendorToDealerSite);
    }
}

export default new VendorTDealerSiteOperation();
