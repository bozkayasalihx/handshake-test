import { Router } from "express";
import { Vendor } from "../../models";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { vendorOperation } from "../../services";
import { createVendorController, getVendorController } from "../../controllers";
import { IVendor } from "../../controllers/vendor/createVendor";
import errorHandler from "../../middlewares/errorHandler";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

const updateVendor = responseFuncGen<Partial<Vendor>>(
    vendorOperation,
    async (body) => {
        const vendor = vendorOperation.createVendor(body);
        return vendor;
    }
);

router.post(
    Routes.CREATE_VENDOR,
    new Validate<IVendor>().validate(validationSchema.createVendorValidation()),
    errorHandler.handleWithAuth(createVendorController)
);

router.get("/:vendorId?", errorHandler.errorBadRequest(getVendorController));

router.patch(
    Routes.CREATE_VENDOR,
    new Validate<Partial<IVendor>>().validate(
        validationSchema.updateVendorValidation()
    ),
    updateVendor
);

export default router;
