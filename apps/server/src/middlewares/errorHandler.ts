import { NextFunction } from "express";
import httpStatus from "http-status";
import { TypedRequest, TypedResponse } from "../types";

import ErrorMatcher from "../scripts/utils/errorMatcher";
import { __prod__ } from "../scripts/dev";

type HandlerFunc = (
    req: TypedRequest<any, any>,
    res: TypedResponse<any>
) => Promise<any>;

type HandlerReturnFunc = (
    req: TypedRequest<any, any>,
    res: TypedResponse<any>,
    next: NextFunction
) => Promise<any>;

class ErrorHandler {
    public handleWithAuth(handlerFunc: HandlerFunc): HandlerReturnFunc {
        return async (req, res) => {
            try {
                return await handlerFunc(req, res);
            } catch (err) {
                !__prod__ && console.log(err);
                const errorMatcher = new ErrorMatcher(err);
                return errorMatcher.matcher(res);
            }
        };
    }

    public errorBadRequest(handler: HandlerFunc): HandlerReturnFunc {
        return async (req, res, next) => {
            try {
                return await handler(req, res);
                // return next();
            } catch (err) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });
            }
        };
    }

    public handlewithoutAuth(handlerFunc: HandlerFunc): HandlerReturnFunc {
        return async (req, res) => {
            try {
                return await handlerFunc(req, res);
            } catch (err) {
                const errorMatcher = new ErrorMatcher(err);
                return errorMatcher.matcher(res);
            }
        };
    }
}

export default new ErrorHandler();
