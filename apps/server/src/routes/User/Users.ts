import { Router } from "express";
import {
    forgotPasswordController,
    loginController,
    logoutController,
    refreshTokenController,
    resetPasswordController,
} from "../../controllers";
import registerControler from "../../controllers/user/registerController";
import { isSetCookie } from "../../middlewares";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema, {
    ILogin,
    IRegister,
} from "../../validations/validationSchema";

import errorHandler from "../../middlewares/errorHandler";

const userRoute = Router();

userRoute
    .route(Routes.LOGIN)
    .post(
        new Validate<ILogin>().validate(validationSchema.loginValidation()),
        errorHandler.handlewithoutAuth(loginController)
    );

userRoute
    .route(Routes.REGISTER)
    .post(
        new Validate<IRegister>().validate(
            validationSchema.registerValidation()
        ),
        errorHandler.handlewithoutAuth(registerControler)
    );

userRoute
    .route(Routes.FORGOT_PASSWORD)
    .post(
        new Validate<{ email: string }>().validate(
            validationSchema.resetPasswordValidation()
        ),
        errorHandler.handlewithoutAuth(forgotPasswordController)
    );

userRoute
    .route("/logout")
    .post(errorHandler.handlewithoutAuth(logoutController));

userRoute
    .route(Routes.RESET_PASSWORD)
    .post(
        new Validate().validate(validationSchema.createPasswordValidation()),
        errorHandler.handlewithoutAuth(resetPasswordController)
    );

userRoute
    .route(Routes.REFRESH_TOKEN)
    .get(isSetCookie, errorHandler.errorBadRequest(refreshTokenController));

export default userRoute;
