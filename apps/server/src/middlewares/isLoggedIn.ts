import { NextFunction } from "express";
import { TypedRequest, TypedResponse } from "../types";

export interface IBody {
    username: string;
    email: string;
    password: string;
}
export default function isLoggedIn(
    req: TypedRequest<IBody>,
    res: TypedResponse,
    next: NextFunction
) {
    if (!req.user) {
        return res.status(401).json({
            message: "NOT FOUND",
        });
    }

    return next();
}
