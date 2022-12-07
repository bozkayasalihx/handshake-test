import { innerBracket } from "../../controllers/advance/updateAdvance";
import httpStatus from "http-status";
import { depositOperation } from "../../services";
import { DepositStatusType, TypedRequest, TypedResponse } from "../../types";

export type IDepositType = {
    vdsbsId: string;
};

export default async function getDeposits(
    req: TypedRequest<IDepositType>,
    res: TypedResponse
) {
    const { vdsbsId } = req.body;

    if (Number.isNaN(vdsbsId)) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid request",
        });
    }

    const user = req.user;
    const nonUserTypes = innerBracket(user.userType);
    const deposits = await depositOperation.repo
        .createQueryBuilder("d")
        .where("d.vdsbs_id = :id", { id: vdsbsId })
        .andWhere(`d.sender_user_type in ${nonUserTypes}`)
        .andWhere("d.status = :status", {
            status: DepositStatusType.PENDING_APPROVAL,
        })
        .leftJoinAndSelect("d.depositLines", "lines")
        .getMany();

    return res.status(httpStatus.OK).json({
        message: "operation succesfull",
        data: deposits,
    });
}
