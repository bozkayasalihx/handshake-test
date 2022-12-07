import httpStatus from "http-status";
import { productOperation } from "../../services";
import { Currency, TypedRequest, TypedResponse } from "../../types";

export interface IProduct {
    productCode: string;
    productName: string;
    unitPrice: bigint;
    currency: Currency;
    vendorId: number;
}

type IQuery = {
    vendorId: string;
};

export default async function getProducts(
    req: TypedRequest<any, IQuery>,
    res: TypedResponse
) {
    const vendorId = parseInt(req.query.vendorId);
    if (Number.isNaN(vendorId)) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "vendor id must be integer",
        });
    }

    const products = await productOperation.repo.find({
        where: {
            vendorId,
        },
    });

    return res.status(httpStatus.CREATED).json({
        message: "succesfully created",
        data: products,
    });
}
