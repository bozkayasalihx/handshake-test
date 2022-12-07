import httpStatus from "http-status";
import { User } from "../../models";
import { IBody } from "../../middlewares/isLoggedIn";
import { __prod__ } from "../../scripts/dev";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../scripts/utils/generateToken";
import userOperation from "../../services/userOperation";
import { OptionalDates, TypedRequest, TypedResponse } from "../../types";

function serialize(user: User, res: TypedResponse, cb: () => any) {
    const refreshToken = generateRefreshToken(
        { id: user.id, tokenVersion: user.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET_KEY as string
    );
    res.cookie("qid", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
        maxAge: 24 * 60 * 60 * 1000,
    });

    return cb();
}

async function registerControler(
    req: TypedRequest<IBody & OptionalDates>,
    res: TypedResponse
) {
    const user = await userOperation.insert(req.body);
    const accessToken = generateAccessToken(
        { id: user.id, tokenVersion: user.tokenVersion },
        process.env.ACCESS_TOKEN_SECRET_KEY as string
    );

    return serialize(user, res, () => {
        return res.status(httpStatus.CREATED).json({
            message: "operation succesful",
            data: {
                username: user.username,
                email: user.email,
                accessToken,
            },
        });
    });
}

export default registerControler;
