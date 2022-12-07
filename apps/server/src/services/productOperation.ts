import { Product, User } from "../models";
import BaseService from "./BaseService";

export class ProductOperation extends BaseService {
    private user: User;

    public setUser(user: User) {
        this.user = user;
    }
    public get repo() {
        return this.source.getRepository(Product);
    }

    public createProduct(params: Partial<Args<Product>>) {
        const newParams = {
            ...params,
            created_by: this.user,
            updated_by: this.user,
        };
        return this.repo.insert(newParams);
    }

    public getProductbyId(params: { id: number }) {
        return this.repo.findOne({ where: { id: params.id } });
    }
}

export default new ProductOperation();
