/* eslint-disable no-unused-expressions */
import { Router } from "express";
import { dealerSiteController } from "../../controllers";
import { IDealerSite } from "../../controllers/dealer/createDealerSite";
import errorHandler from "../../middlewares/errorHandler";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { dealerOperation, dealerSiteOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

const updateDealerSite = responseFuncGen<{ name: string; dealerId: number }>(
    dealerSiteOperation,
    async (body) => {
        const { name, dealerId, id } = body;

        const dealer = await dealerSiteOperation.repo.findOne({
            where: { id },
        });

        if (!dealer) return dealer;

        const dealerSite = await dealerOperation.repo.findOne({
            where: { id: dealerId },
        });

        if (!dealerSite) return dealerSite;

        dealerId && (dealer.dealerId = dealerId);
        name && (dealerSite.name = name);

        return dealerSite;
    }
);

router.post(
    Routes.CREATE_DEALER_SITE,
    new Validate<IDealerSite>().validate(
        validationSchema.createDealerSiteValidation()
    ),
    errorHandler.handleWithAuth(dealerSiteController)
);

router.patch(
    Routes.CREATE_DEALER_SITE,
    new Validate<Partial<IDealerSite>>().validate(
        validationSchema.updateDealerSiteValidation()
    ),
    updateDealerSite
);

export default router;
