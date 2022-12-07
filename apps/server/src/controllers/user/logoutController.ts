import httpStatus from "http-status";
import { TypedRequest, TypedResponse } from "../../types";

async function logoutController(req: TypedRequest, res: TypedResponse) {
    res.clearCookie("qid");

    return res.status(httpStatus.OK).json({
        message: "operation succesful",
    });
}

export default logoutController;
