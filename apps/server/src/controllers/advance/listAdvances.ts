import httpStatus from "http-status";
import { advanceOperation } from "../../services";
import { AdvanceStatusType, TypedRequest, TypedResponse } from "../../types";
import { innerBracket } from "./updateAdvance";

export interface IListAdvance {
    vdsbsId: number;
}

export default async function listAdvance(
    req: TypedRequest<IListAdvance>,
    res: TypedResponse
) {
    const user = req.user;
    const { vdsbsId } = req.body;

    const nonUserTypes = innerBracket(user.userType);
    const advances = await advanceOperation.repo
        .createQueryBuilder("a")
        .where("a.vdsbs_id = :id", { id: vdsbsId })
        .andWhere(`a.sender_user_type in ${nonUserTypes}`)
        .andWhere(`a.status = :s1 OR a.status = :s2`, {
            s2: AdvanceStatusType.ENTERED,
            s1: AdvanceStatusType.PENDING_APPROVAL,
        })
        .select([
            "a.id",
            "a.amount",
            "a.currency",
            "a.status",
            "a.advance_type",
        ])
        .execute();

    return res.status(httpStatus.OK).json({
        message: "operation succesfull",
        data: advances,
    });
}
