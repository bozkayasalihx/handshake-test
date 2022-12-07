import { Router } from "express";
import { buyerSiteController } from "../../controllers";
import { IBuyerSite } from "../../controllers/buyer/createBuyerSite";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { buyerSiteOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

import errorHandler from "../../middlewares/errorHandler";

const router = Router();

const updateBuyerSite = responseFuncGen<{ name: string }>(
    buyerSiteOperation,
    async (body) => {
        const { id, name } = body;
        const buyerSite = await buyerSiteOperation.repo.findOne({
            where: { id },
        });

        if (name && buyerSite) buyerSite.name = name;
        return buyerSite;
    }
);

router.post(
    Routes.CREATE_BUYER_SITE,
    new Validate<IBuyerSite>().validate(
        validationSchema.createBuyerSiteValidation()
    ),
    errorHandler.handleWithAuth(buyerSiteController)
);

router.patch(
    Routes.CREATE_BUYER_SITE,
    new Validate<Partial<IBuyerSite>>().validate(
        validationSchema.updateBuyerSiteValidation()
    ),
    updateBuyerSite
);

export default router;
