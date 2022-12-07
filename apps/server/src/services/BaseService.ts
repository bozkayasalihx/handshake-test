import { appDataSource } from "../loaders";

export default class BaseService {
    protected get source() {
        return this.dataSource;
    }

    private get dataSource() {
        return appDataSource;
    }
}
