import { Router } from "express";
import { getInvoicesController } from "../../controllers";
import { IGetInvoice } from "../../controllers/invoice/getInvoices";
import updateInvoiceControler, {
    IUpdateInvoice,
} from "../../controllers/invoice/updateInvoices";
import { Validate } from "../../middlewares";
import errorHandler from "../../middlewares/errorHandler";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router
    .route(Routes.GET_INVOICE)
    .post(
        new Validate<IGetInvoice>().validate(validationSchema.getInvoice()),
        errorHandler.handleWithAuth(getInvoicesController)
    );

router
    .route(Routes.UPDATE_INVOICE)
    .post(
        new Validate<IUpdateInvoice>().validate(
            validationSchema.updateInvoice()
        ),
        errorHandler.handleWithAuth(updateInvoiceControler)
    );

export default router;
