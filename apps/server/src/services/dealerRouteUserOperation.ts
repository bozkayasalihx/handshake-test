import { DealerRouteUser } from "../models";
import BaseService from "./BaseService";

export class DealerRouteService extends BaseService {
    public get repo() {
        return this.source.getRepository(DealerRouteUser);
    }

    public insertUE(params: Partial<DealerRouteUser>) {
        return this.repo.insert({ ...params });
    }
}

export default new DealerRouteService();
