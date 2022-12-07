import httpStatus from "http-status";
import { innerBracket } from "../../controllers/advance/updateAdvance";
import { Advance, PaymentApprovalHeader } from "../../models";
import { advanceOperation, paymentApprovalOperation } from "../../services";
import {
    AdvanceStatusType,
    AdvanceType,
    PaymentApprovalStatus,
    PaymentType,
    TypedRequest,
    TypedResponse,
    UserTypes
} from "../../types";

export interface IListApprovals {
    vdsbsId: number;
}

async function listPaymentApprovals(
    req: TypedRequest<IListApprovals>,
    res: TypedResponse
) {
    const { user } = req;
    const { vdsbsId } = req.body;

    let pheader: PaymentApprovalHeader[],
        advance: Advance[] = [];

    const nonUserType = innerBracket(user.userType);
    const dealerRelated =
        user.userType == UserTypes.DEALER_ADMIN ||
        user.userType == UserTypes.DEALER;

    let paymentApprovalQb = paymentApprovalOperation.headerRepo
        .createQueryBuilder("ph")
        .where("ph.vdsbs_id = :id", { id: vdsbsId })
        .andWhere(`ph.sender_user_type in ${nonUserType}`)
        .andWhere("ph.status = :status", {
            status: PaymentApprovalStatus.PENDING,
        });

    let advancesQb = advanceOperation.repo
        .createQueryBuilder("a")
        .where("a.vdsbs_id = :id", { id: vdsbsId })
        .andWhere(`a.sender_user_type in ${nonUserType}`)
        .andWhere("a.status = :status", {
            status: AdvanceStatusType.PENDING_APPROVAL,
        });

    if (dealerRelated) {
        pheader = await paymentApprovalQb
            .andWhere("ph.type = :type", {
                type: PaymentType.CASH,
            })
            .getMany();
        advance = await advancesQb
            .andWhere("a.advance_type = :atype", {
                atype: AdvanceType.CASH,
            })
            .getMany();
    }

    advance = await advancesQb.getMany();
    pheader = await paymentApprovalQb.getMany();

    return res.status(httpStatus.OK).json({
        message: "operation successfull",
        data: {
            paymentHeaders: pheader,
            advances: advance,
        },
    });
}

export default listPaymentApprovals;
