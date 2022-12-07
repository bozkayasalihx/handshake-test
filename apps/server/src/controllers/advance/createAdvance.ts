import httpStatus from "http-status";
import bankOperations from "../../scripts/banks/bankOperations";
import { advanceOperation, paymentOperation } from "../../services";
import {
    AdvanceStatusType,
    AdvanceType,
    Currency,
    PaymentType,
    TypedRequest,
    TypedResponse,
    UserTypes,
} from "../../types";

export interface IAdvance {
    advanceType: AdvanceType;
    amount: number;
    currency?: Currency;
    vdsbsId: number;
}

export default async function createAdvance(
    req: TypedRequest<IAdvance>,
    res: TypedResponse
) {
    const { advanceType, amount, currency, vdsbsId } = req.body;
    const { user } = req;

    const buyerRelated =
        user.userType == UserTypes.BUYER ||
        user.userType == UserTypes.BUYER_ADMIN;
    const notCash = advanceType !== AdvanceType.CASH;

    const advance = await advanceOperation.repo
        .create({
            advanceType,
            currency,
            vdsbsId,
            created_by: user,
            updated_by: user,
            senderUserType: user.userType,
            amount: amount,
        })
        .save();

    if (buyerRelated && notCash) {
        const bankResult = bankOperations.done(amount);
        if (!bankResult) {
            res.status(httpStatus.BAD_REQUEST).json({
                message: "an error accured try again later",
            });
        }

        await paymentOperation.paymentRepo
            .create({
                effectiveDate: new Date(Date.now()),
                created_by: user,
                updated_by: user,
                originalAmount: amount,
                remainedAmount: amount,
                paymentType: PaymentType.ADVANCE,
                vdsbsId,
                referece_id: advance.id,
            })
            .save();

        advance.approvalDate = new Date(Date.now());
        advance.approvedById = user.id;
        advance.senderUserType = user.userType;
        advance.status = AdvanceStatusType.APPROVED;

        await advance.save();
    }

    return res.status(httpStatus.CREATED).json({
        message: "operation succesful",
    });
}
