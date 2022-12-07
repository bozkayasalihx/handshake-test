import { Deposit } from "../models";
import BaseService from "./BaseService";

export class DepositOperation extends BaseService {
    private Model = Deposit;

    public get repo() {
        return this.source.getRepository(this.Model);
    }

    public insert(params: Partial<Deposit>) {
        return this.repo.insert({ ...params });
    }
}

export default new DepositOperation();
