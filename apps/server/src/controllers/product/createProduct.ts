import { Currency, TypedRequest, TypedResponse } from "../../types";
import { productOperation } from "../../services";
import httpStatus from "http-status";

export interface IProduct {
    productCode: string;
    productName: string;
    unitPrice: bigint;
    currency: Currency;
    vendorId: number;
}

export default async function createProduct(
    req: TypedRequest<IProduct>,
    res: TypedResponse
) {
    const { user } = req;
    const data = req.body;

    productOperation.setUser(user);
    await productOperation.createProduct({
        productCode: data.productCode,
        productName: data.productName,
        unitPrice: data.unitPrice,
        vendorId: data.vendorId,
        currency: data.currency,
    });

    return res.status(httpStatus.CREATED).json({
        message: "succesfully created",
    });
}
