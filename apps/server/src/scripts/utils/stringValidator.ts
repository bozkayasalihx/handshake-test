import { Response } from "express";
import httpStatus from "http-status";
import { __prod__ } from "../dev";

export class StringValidator {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    public parse(res: Response) {
        const valid = this.value.split(/\s/);
        if (!valid) {
            res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid request",
            });
        }

        return {
            head: valid[0],
            body: valid[1],
        };
    }

    public validateHeader(header: string) {
        const ALLOWEDTYPES = ["Bearer", "Basic"];

        if (!__prod__) ALLOWEDTYPES.push("Digest");

        return ALLOWEDTYPES.indexOf(header) !== -1 ? true : false;
    }
}
