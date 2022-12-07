import { Router } from "express";
import { buyerControler } from "../../controllers";
import { IBuyer } from "../../controllers/buyer/createBuyer";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { buyerOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

import errorHandler from "../../middlewares/errorHandler";

const router = Router();

const updatedBuyer = responseFuncGen<{ name: string; taxNo: number }>(
    buyerOperation,
    async (body) => {
        const { id, name, taxNo } = body;
        const buyer = await buyerOperation.repo.findOne({
            where: { id },
        });

        if (name && buyer) buyer.name = name;
        if (taxNo && buyer) buyer.taxNo = String(taxNo);
        return buyer;
    }
);

router.post(
    Routes.CREATE_BUYER,
    new Validate<IBuyer>().validate(validationSchema.createBuyerValidation()),
    errorHandler.handleWithAuth(buyerControler)
);

router.patch(
    Routes.CREATE_BUYER,
    new Validate<Partial<IBuyer>>().validate(
        validationSchema.updateBuyerValidation()
    ),
    updatedBuyer
);
export default router;
