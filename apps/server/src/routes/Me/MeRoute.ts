import { Router } from "express";
import errorHandler from "../../middlewares/errorHandler";
import { meController } from "../../controllers";
import { Routes } from "../../types/routePath";

const meRouter = Router();

meRouter.get(Routes.ME, errorHandler.handleWithAuth(meController));
export default meRouter;
