import { Router } from "express";
import {
    createAdvanceController,
    listAdvanceController,
    updateAdvanceController,
} from "../../controllers";
import { IAdvance } from "../../controllers/advance/createAdvance";
import { IListAdvance } from "../../controllers/advance/listAdvances";
import { IUpdateAdvance } from "../../controllers/advance/updateAdvance";
import { Validate } from "../../middlewares";
import errorHandler from "../../middlewares/errorHandler";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();
router.post(
    Routes.CREATE_ADVANCE,
    new Validate<IAdvance>().validate(validationSchema.createAdvance()),
    errorHandler.handleWithAuth(createAdvanceController)
);

router.patch(
    Routes.UPDATE_ADVANCE,
    new Validate<IUpdateAdvance>().validate(validationSchema.updateAdvance()),
    errorHandler.handleWithAuth(updateAdvanceController)
);

router.post(
    Routes.GET_ADVANCE,
    new Validate<IListAdvance>().validate(validationSchema.listAdvance()),
    errorHandler.handleWithAuth(listAdvanceController)
);

export default router;
