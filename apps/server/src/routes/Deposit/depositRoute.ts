import { Router } from "express";
import {
    createDeposit,
    getDeposits,
    updateDepositController,
} from "../../controllers";
import { DepositType } from "../../controllers/deposit/createDeposit";
import { IDepositType } from "../../controllers/deposit/getDeposits";
import { UpdateDepositType } from "../../controllers/deposit/updateDeposit";
import { Validate } from "../../middlewares";
import errorHandler from "../../middlewares/errorHandler";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_DEPOSIT,
    new Validate<DepositType>().validate(validationSchema.createDeposit()),
    errorHandler.handleWithAuth(createDeposit)
);

router.post(
    Routes.GET_DEPOSIT,
    new Validate<IDepositType>().validate(validationSchema.getDeposits()),
    errorHandler.handleWithAuth(getDeposits)
);

router.patch(
    Routes.UPDATE_DEPOSIT,
    new Validate<UpdateDepositType>().validate(
        validationSchema.updateDeposit()
    ),
    errorHandler.handleWithAuth(updateDepositController)
);

export default router;
