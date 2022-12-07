import { NextFunction } from "express";
import httpStatus from "http-status";
import { TypedRequest, TypedResponse, UserTypes } from "../types";
import { accesableRoute } from "../types/routePath";

export default function permission(
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
) {
    const { userType } = req.user;
    const { url } = req;

    const commingRoute = url.match(/\/(.*)\//);
    if (!commingRoute) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "route not found",
        });
    }

    const wantedRoute = "/" + commingRoute[1];
    const valid = Object.values(UserTypes).indexOf(userType) !== -1;

    if (!valid) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "not autorizated",
        });
    }

    switch (userType) {
        case UserTypes.BUYER_ADMIN: {
            for (const route of accesableRoute.get(UserTypes.BUYER_ADMIN)!) {
                if (wantedRoute === route) {
                    return next();
                }
            }
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.DEALER_ADMIN: {
            for (const route of accesableRoute.get(UserTypes.DEALER_ADMIN)!) {
                if (wantedRoute === route) {
                    return next();
                }
            }
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.VENDOR_ADMIN: {
            for (const route of accesableRoute.get(UserTypes.VENDOR_ADMIN)!) {
                if (wantedRoute === route) {
                    return next();
                }
            }
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.BUYER: {
            for (const route of accesableRoute.get(UserTypes.BUYER)!) {
                if (wantedRoute === route) {
                    return next();
                }
            }

            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.DEALER: {
            for (const route of accesableRoute.get(UserTypes.DEALER)!) {
                if (wantedRoute === route) {
                    return next();
                }
            }

            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.VENDOR: {
            for (const route of accesableRoute.get(UserTypes.VENDOR)!) {
                if (wantedRoute === route) {
                    return next();
                }
            }

            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        case UserTypes.SITE_ADMIN: {
            return next();
        }
        default: {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "no such as user type",
            });
        }
    }
}
