import httpStatus from "http-status";
import { Advance, User } from "../../models";
import DatabaseTransaction from "../../scripts/transection/databaseTransection";
import { advanceOperation, paymentOperation } from "../../services";
import {
    AdvanceStatusType,
    InvoicedStatusType,
    PaymentType,
    TypedRequest,
    TypedResponse,
    UserTypes,
} from "../../types";

const ALIAS = "a";

export interface IUpdateAdvance {
    isApproved: boolean;
    advanceIds: Array<number>;
}

export function innerBracket(type: string) {
    const vals = Object.values(UserTypes);
    let str = "(";
    for (let i = 0; i < vals.length; i++) {
        if (vals[i].includes(type) || type.includes(vals[i])) {
            if (i == vals.length - 1) str += ")";
            continue;
        }
        if (i == vals.length - 1) {
            str += `,'${vals[i]}')`;
        } else {
            if (i == 0) str += `'${vals[i]}'`;
            else str += `,'${vals[i]}'`;
        }
    }
    return str;
}

export function doWhat<
    G extends Record<"approvalDate" | "approvedBy" | "updated_by", any>,
    T extends unknown
>(list: Array<G>, what: boolean, user: User, STATUS: T) {
    for (let i = 0; i < list.length; i++) {
        list[i].approvalDate = new Date(Date.now());
        list[i].approvedBy = user;
        list[i].updated_by = user;
        if (what) {
            //@ts-ignore
            list[i].status = STATUS.APPROVED;
        } else {
            //@ts-ignore
            list[i].status = STATUS.REJECTED;
        }
    }

    return list;
}

export default async function updateAdvance(
    req: TypedRequest<IUpdateAdvance>,
    res: TypedResponse
) {
    const user = req.user;
    const { isApproved, advanceIds } = req.body;

    const nonUserTypes = innerBracket(user.userType);

    await DatabaseTransaction.transection(async (qr) => {
        const advanceList = await advanceOperation.repo
            .createQueryBuilder(ALIAS)
            .where(`a.sender_user_type in ${nonUserTypes}`)
            .andWhereInIds(advanceIds)
            .andWhere("a.status = :s1 OR a.status = :s2", {
                s1: AdvanceStatusType.PENDING_APPROVAL,
                s2: AdvanceStatusType.ENTERED,
            })
            .getMany();

        const list = doWhat<Advance, typeof AdvanceStatusType>(
            advanceList,
            isApproved,
            user,
            AdvanceStatusType
        );

        if (list.length == 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message:
                    "haven't found  any advances that you specified criteria",
            });
        }

        const advancesList = await qr.manager.save(list);

        for (let i = 0; i < advancesList.length; i++) {
            const cur = advanceList[i];
            if (cur.status == AdvanceStatusType.APPROVED) {
                const p = paymentOperation.paymentRepo.create({
                    created_by: user,
                    updated_by: user,
                    currency: cur.currency,
                    invoicedStatus: InvoicedStatusType.NO_INVOICE,
                    originalAmount: cur.amount,
                    remainedAmount: cur.amount,
                    paymentType: PaymentType.ADVANCE,
                    referece_id: cur.id,
                    vdsbsId: cur.vdsbsId,
                    effectiveDate: new Date(Date.now()),
                });

                await qr.manager.save(p);
            }
        }

        return res.status(httpStatus.OK).json({
            message: "operation succesfull",
        });
    }, res);
}
