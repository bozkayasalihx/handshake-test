import { Router } from "express";
import { getHasVdsbsAccess } from "../../controllers";
import { Validate } from "../../middlewares";
import errorHandler from "../../middlewares/errorHandler";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.LIST_AUTHORITY,
    new Validate<{ userId: number }>().validate(
        validationSchema.getUserAccess()
    ),
    errorHandler.handleWithAuth(getHasVdsbsAccess)
);

export default router;
