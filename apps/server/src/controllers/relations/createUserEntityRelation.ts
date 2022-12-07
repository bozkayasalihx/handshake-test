/* eslint-disable import/no-cycle */
/* eslint-disable camelcase */
import httpStatus from "http-status";
import {
    beSure,
    convertToSnakeCase,
    isContain,
} from "../../scripts/utils/isContains";
import userEntityRelationOperation from "../../services/userEntityRelationOperation";
import userOperation from "../../services/userOperation";

import { OptionalDates, TypedRequest, TypedResponse } from "../../types";

export interface IUserEntityRelation extends OptionalDates {
    userId: number;
    description: string;
    vendorTableRef?: number;
    buyerSiteTableRef?: number;
    dealerSiteTableRef?: number;
}

export default async function createUserEntityRelation(
    req: TypedRequest<IUserEntityRelation>,
    res: TypedResponse
) {
    const { description, userId, end_date, start_date, ...ids } = req.body;

    const user = await userOperation.repo.findOne({
        where: { id: userId },
    });
    if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
            message: "not found",
        });
    }

    if (!Object.keys(ids).length) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "must container ref ids",
        });
    }
    const { error, hashMap, validOne } = isContain(ids);

    if (!error.valid) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "more than one or zero nonnullable field not allowed",
        });
    }

    const valid = await beSure(validOne);

    if (!valid) {
        return res.status(httpStatus.NOT_FOUND).json({
            message: "not found",
        });
    }
    const snakeCaseValidOne = convertToSnakeCase(validOne);
    const data = await userEntityRelationOperation.repo
        .createQueryBuilder("uer")
        .where(
            `${Object.keys(snakeCaseValidOne)[0]}_id = ${
                Object.values(snakeCaseValidOne)[0]
            } AND user_id = ${userId}`
        )
        .select("1")
        .execute();

    if (data.length) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "already exists",
        });
    }

    await userEntityRelationOperation.insertUE({
        description,
        user,
        updated_by: req.user,
        created_by: req.user,
        start_date,
        end_date,
        ...hashMap,
    });

    return res.status(httpStatus.OK).json({
        message: "operation succesful",
    });
}
