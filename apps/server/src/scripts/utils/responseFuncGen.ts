import httpStatus from "http-status";
import * as Services from "../../services";
import { TypedRequest, TypedResponse } from "../../types";
import ErrorMatcher from "./errorMatcher";

type ConfigList = typeof Services[keyof typeof Services];
type Maybe<T> = Promise<T> | T;

type Callback<T> = (body: T) => Maybe<(any & { id: number }) | null>;

export const responseFuncGen =
    <T>(operator: ConfigList, cb: Callback<Partial<T> & { id: number }>) =>
    async (
        req: TypedRequest<Partial<T> & { id: number }>,
        res: TypedResponse
    ) => {
        try {
            const { user } = req;
            const results = await cb(req.body);
            if (!results) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });
            }

            if (Array.isArray(results)) {
                for (let i = 0; i < results.length; i++) {
                    results[i].updated_by = user;

                    if (results[i]?.save) {
                        results[i]?.save && (await results[i].save());
                    } else {
                        //@ts-ignore
                        await operator.repo.update(
                            { id: results[i].id },
                            results[i]
                        );
                    }
                }
            } else {
                results.updated_by = user;

                if (results?.save) {
                    results?.save && (await results.save());
                } else {
                    //@ts-ignore
                    await operator.repo.update({ id: results.id }, results);
                }
            }
            return res.status(httpStatus.OK).json({
                message: "successfully updated",
            });
        } catch (err) {
            const errorMatcher = new ErrorMatcher(err);
            return errorMatcher.matcher(res);
        }
    };
