import { NextFunction } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";
import { errorSlugify } from "../scripts/textSlugify";
import { TypedRequest, TypedResponse } from "../types";

export default class Validate<T> {
    public validate(schema: ObjectSchema<T>) {
        return (req: TypedRequest, res: TypedResponse, next: NextFunction) => {
            const { error, value } = schema.validate(req.body);
            if (error) {
                const errorMessage = errorSlugify(error.details);
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json({ message: errorMessage });
            }
            Object.assign(req, value);
            return next();
        };
    }
}
