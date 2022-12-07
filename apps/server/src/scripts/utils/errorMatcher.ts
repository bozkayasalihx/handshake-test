import httpStatus from "http-status";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { QueryFailedError } from "typeorm";
import { TypedResponse } from "../../types";

type CustomError = Error & Record<string, any>;

class ErrorMatcher extends Error {
    private error: CustomError;

    constructor(err: CustomError) {
        super();
        this.error = err;
    }

    matcher(res: TypedResponse) {
        const err = this.error;

        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: err.detail.split("=")[1],
            });
        }

        if (err instanceof TokenExpiredError) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "token expired",
            });
        }

        if (err instanceof JsonWebTokenError) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "malformed token",
            });
        }

        if (err instanceof QueryFailedError) {
            return res.status(httpStatus.BAD_REQUEST).json({
                //@ts-ignore
                message: err.detail
                    ? //@ts-ignore
                      err.detail.replace(/[^a-zA-Z0-9_= ]/g, "")
                    : err.message,
            });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured",
        });
    }
}

export default ErrorMatcher;
