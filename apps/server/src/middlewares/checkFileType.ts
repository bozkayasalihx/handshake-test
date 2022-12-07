import { NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import httpStatus from "http-status";
import { __prod__ } from "../scripts/dev";
import { TypedRequest, TypedResponse } from "../types";

const ALLOWEDTYPES = ["csv", "xlsx"];

if (!__prod__) ALLOWEDTYPES.push("jpeg");

export default async function checkFileType(
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
) {
    if (!req.files?.file) {
        return res.status(httpStatus.NOT_FOUND).json({
            message: "no file uploaded",
        });
    }

    // eslint-disable-next-line prefer-regex-literals
    const regex = new RegExp(".([a-z]{3,})$", "gi");
    const file = req.files?.file as UploadedFile;
    const results = regex.exec(file.name);

    if (!results) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid file type",
        });
    }
    if (ALLOWEDTYPES.includes(results[1])) {
        return next();
    }

    return res.status(httpStatus.BAD_REQUEST).json({
        message: "invalid file type",
    });
}
