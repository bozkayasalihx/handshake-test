import { Buyer } from "../models";
import BaseService from "./BaseService";

export class BuyerOperation extends BaseService {
    public get repo() {
        return this.source.getRepository(Buyer);
    }

    public async insertBuyer(params: Partial<Buyer>) {
        const newBuyer = this.repo.create(params);

        return this.repo.insert(newBuyer);
    }

    public async updateBuyer(params: Partial<Buyer>) {
        return this.repo.save(params);
    }

    public createBuyer(params: Partial<Buyer>) {
        return this.repo.create(params);
    }
}

const buyerOperation = new BuyerOperation();
export default buyerOperation;
