import jwt from "jsonwebtoken";
import { __prod__ } from "../dev";

export interface IGenerateToken {
    id: number;
    tokenVersion: number;
}

export function generateAccessToken(params: IGenerateToken, secretKey: string) {
    return jwt.sign(params, secretKey, {
        expiresIn: !__prod__ ? "7d" : "10m",
    });
}

export function generateRefreshToken(
    params: IGenerateToken,
    secretKey: string
) {
    return jwt.sign(params, secretKey, {
        expiresIn: "1d",
    });
}
