import { Dealer } from "../models";
import BaseService from "./BaseService";

export class DealerOperation extends BaseService {
    public get repo() {
        return this.source.getRepository(Dealer);
    }

    public async insertDealer(params: Partial<Dealer>) {
        const dealer = await this.repo.insert(params);
        return dealer;
    }

    public createDealer(params: Partial<Dealer>) {
        return this.repo.create(params);
    }

    public async updateDealer(params: Partial<Dealer>) {
        const dealer = await this.repo.save(params);
        return dealer;
    }
}

export default new DealerOperation();
