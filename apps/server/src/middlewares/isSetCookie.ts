import { NextFunction } from "express";
import httpStatus from "http-status";
import { TypedRequest, TypedResponse } from "../types";

export default function isSetCookie(
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
) {
    const cookie = req.cookies;
    if (!cookie?.qid) return res.sendStatus(httpStatus.UNAUTHORIZED);
    req.refreshToken = cookie.qid;
    return next();
}
