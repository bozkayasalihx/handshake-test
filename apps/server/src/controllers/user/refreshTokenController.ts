import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../../scripts/utils/generateToken";
import { userOperation } from "../../services";
import { TypedRequest, TypedResponse } from "../../types";

async function refreshController(req: TypedRequest, res: TypedResponse) {
    const { refreshToken } = req;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: true });

    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
    const user = await userOperation.repo.findOne({
        where: { id: decoded.userId },
    });

    if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "unauthorized request",
        });
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
    ) as jwt.JwtPayload;

    const newRefreshToken = generateRefreshToken(
        { tokenVersion: 0, id: user.id },
        process.env.REFRESH_TOKEN_SECRET_KEY
    );

    res.cookie("qid", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(httpStatus.OK).json({
        message: "succesful operation",
        data: { refreshToken },
    });
}

export default refreshController;
