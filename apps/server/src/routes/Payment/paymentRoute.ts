import { Router } from "express";
import {
    listAvailablePS,
    listPaymentApprovals,
    processApprovals,
    processPaymentPS,
} from "../../controllers";
import { IListAvailablePS } from "../../controllers/payment/listAvailablePS";
import { IListApprovals } from "../../controllers/payment/listPaymentApprovals";
import { IApprovals } from "../../controllers/payment/processApprovals";
import { IProcessPayment } from "../../controllers/payment/processPayments";
import { Validate } from "../../middlewares";
import errorHandler from "../../middlewares/errorHandler";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router
    .route(Routes.LIST_AVAILABLE_PS)
    .post(
        new Validate<IListAvailablePS>().validate(
            validationSchema.listAvailablePs()
        ),
        errorHandler.handleWithAuth(listAvailablePS)
    );

router
    .route(Routes.PROCESS_PS)
    .post(
        new Validate<IProcessPayment>().validate(
            validationSchema.procesPaymentPS()
        ),
        errorHandler.handleWithAuth(processPaymentPS)
    );

router
    .route(Routes.LIST_PAYMENT_APPROVALS)
    .post(
        new Validate<IListApprovals>().validate(
            validationSchema.listPaymentApprovals()
        ),
        errorHandler.handleWithAuth(listPaymentApprovals)
    );

router
    .route(Routes.PROCESSS_APPROVALS)
    .post(
        new Validate<IApprovals>().validate(
            validationSchema.processApprovals()
        ),
        errorHandler.handleWithAuth(processApprovals)
    );
export default router;
