import httpStatus from "http-status";
import {
    dealerRouteUserOperation,
    userOperation,
    userVdsbsAccess,
} from "../../services";
import { TypedRequest, TypedResponse } from "../../types";

export interface IDealerRouteUser {
    vdsbsId: number;
    userId: number;
    description?: string;
}

export default async function dealerRouteUser(
    req: TypedRequest<IDealerRouteUser>,
    res: TypedResponse
) {
    const { user } = req;
    const { userId, vdsbsId, description } = req.body;

    const findedUser = await userOperation.repo.findOne({
        where: { id: userId },
    });

    if (!findedUser) {
        return res.status(httpStatus.NOT_FOUND).json({
            message: "user not found",
        });
    }

    userVdsbsAccess.setUserId = userId;
    const vdsbsIds = await (
        await userVdsbsAccess.tableRouter(false, true)
    ).reformater();

    if (!userVdsbsAccess.valid) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "user has no access",
        });
    }

    if (vdsbsIds) {
        return res.status(httpStatus.NOT_FOUND).json({
            message: "that relation not found",
        });
    }

    await dealerRouteUserOperation.insertUE({
        vdsbsId,
        created_by: user,
        updated_by: user,
        description,
        user: findedUser,
    });

    return res.status(httpStatus.CREATED).json({
        message: "operation successful",
    });
}
