import { Advance } from "../models";
import BaseService from "./BaseService";

export class AdvanceOperation extends BaseService {
    private Model = Advance;

    public get repo() {
        return this.source.getRepository(this.Model);
    }

    public createAdvance(params: Partial<Advance>) {
        return this.repo.insert({ ...params });
    }
}

export default new AdvanceOperation();
