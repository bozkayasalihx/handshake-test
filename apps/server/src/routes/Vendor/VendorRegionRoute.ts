import { Router } from "express";
import { createVendorRegionController } from "../../controllers";
import { IVendorRegion } from "../../controllers/vendor/createVendorRegion";
import { UpdateVendorRegion } from "../../controllers/vendor/updateVendorRegion";
import errorHandler from "../../middlewares/errorHandler";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { vendorOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

const updateVendorRegion = responseFuncGen<
    Partial<IVendorRegion> & { id: number }
>(vendorOperation, (body) => {
    const vendorRegion = vendorOperation.createVendorRegion(body);
    return vendorRegion;
});

router.post(
    Routes.CREATE_VENDOR_REGION,
    new Validate<{ name: string }>().validate(
        validationSchema.createVendorRegionValidation()
    ),
    errorHandler.handleWithAuth(createVendorRegionController)
);

router.patch(
    Routes.CREATE_VENDOR_REGION,
    new Validate<UpdateVendorRegion>().validate(
        validationSchema.updateVendorRegion()
    ),
    updateVendorRegion
);
export default router;
