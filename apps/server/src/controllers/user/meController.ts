import httpStatus from "http-status";
import { TypedRequest, TypedResponse } from "../../types";

export default async function me(req: TypedRequest, res: TypedResponse) {
    const { user } = req;
    return res.status(httpStatus.OK).json({
        message: "operation succesful",
        data: {
            username: user.username,
            user_type: user.userType,
            id: user.id,
        },
    });
}
