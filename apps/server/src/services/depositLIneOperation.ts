import { DepositLine } from "../models";

import BaseService from "./BaseService";

export class DepositLineOperation extends BaseService {
    private Model = DepositLine;

    public get repo() {
        return this.source.getRepository(this.Model);
    }

    public insert(params: Partial<DepositLine>) {
        return this.repo.insert({ ...params });
    }
}

export default new DepositLineOperation();
