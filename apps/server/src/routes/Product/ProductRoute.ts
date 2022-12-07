import { Router } from "express";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { createProduct, getProducts } from "../../controllers";
import { IProduct } from "../../controllers/product/createProduct";
import { Validate } from "../../middlewares";
import errorHandler from "../../middlewares/errorHandler";
import { productOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const productRoute = Router();

type UpdateProductParams = Omit<IProduct, "productCode">;

const updateProduct = responseFuncGen<UpdateProductParams>(
    productOperation,
    async (body) => {
        const product = await productOperation.repo.findOne({
            where: {
                vendorId: body.vendorId,
            },
        });

        if (!product) return product;

        const newProduct = { ...product, ...body };

        return newProduct;
    }
);

productRoute.post(
    Routes.CREATE_PRODUCT,
    new Validate<IProduct>().validate(validationSchema.createProduct()),
    errorHandler.handleWithAuth(createProduct)
);

productRoute.patch(
    Routes.UPDATE_PRODUCT,
    new Validate<Partial<IProduct>>().validate(
        validationSchema.updateProduct()
    ),
    updateProduct
);

productRoute.get(Routes.GET_PRODUCT, errorHandler.handleWithAuth(getProducts));

export default productRoute;
