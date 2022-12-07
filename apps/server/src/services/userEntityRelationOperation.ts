import { UserEntityRelation } from "../models";
import BaseService from "./BaseService";

export class UseEntityRelationOperation extends BaseService {
    public get repo() {
        return this.source.getRepository(UserEntityRelation);
    }

    public insertUE(params: Partial<UserEntityRelation>) {
        return this.repo.insert({ ...params });
    }
}

export default new UseEntityRelationOperation();
