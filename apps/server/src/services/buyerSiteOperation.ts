import { BuyerSite } from "../models";
import BaseService from "./BaseService";

export class BuyerSiteOperation extends BaseService {
    get repo() {
        return this.source.getRepository(BuyerSite);
    }

    public async insertBuyerSite(params: Partial<BuyerSite>) {
        const newBuyer = this.repo.create(params);

        return this.repo.save(newBuyer);
    }

    public async updateBuyerSite(params: Partial<BuyerSite>) {
        return this.repo.save(params);
    }

    public createBuyerSite(params: Partial<BuyerSite>) {
        return this.repo.create(params);
    }
}

export default new BuyerSiteOperation();
