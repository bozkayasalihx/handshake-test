import {
    buyerSiteOperation,
    dealerSiteOperation,
    vendorOperation,
} from "../../services";
import { UserTypes } from "../../types";

export function convertToSnakeCase(obj: Record<string, any>) {
    const keys = Object.keys(obj);
    const newObj: Record<string, any> = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        newObj[key.replace(/[A-Z]/g, (finded) => `_${finded.toLowerCase()}`)] =
            obj[key];
    }

    return newObj;
}

export function isContain(params: Record<string, any>) {
    const hashMap: Record<string, any> = {};
    const error: { valid: boolean } = { valid: true };
    const validOne: { [x: string]: number } = {};
    let i = 0;
    for (const [key, value] of Object.entries(params)) {
        hashMap[key] = value;
        if (value) {
            i++;
            validOne[key] = value;
        }
        if (!(key in hashMap)) hashMap[key] = value;
    }
    if (i > 1 || i === 0) error.valid = false;
    i = 0;

    return {
        hashMap,
        error,
        validOne,
    };
}

enum Types {
    VENDOR = "vendor",
    BUYER_SITE = "buyerSite",
    DEALER_SITE = "dealerSite",
}
export async function beSure(obj: { [x: string]: number }) {
    const key = Object.keys(obj)[0];
    if (!key.includes("Table")) return false;
    const type = key.split("Table")[0];
    switch (type) {
        case Types.VENDOR: {
            const data = await vendorOperation.repo.findOne({
                where: { id: obj[key] },
            });

            if (data) return true;
            return false;
        }

        case Types.DEALER_SITE: {
            const data = await dealerSiteOperation.repo.findOne({
                where: { id: obj[key] },
            });

            if (data) return true;
            return false;
        }

        case Types.BUYER_SITE: {
            const data = await buyerSiteOperation.repo.findOne({
                where: { id: obj[key] },
            });

            if (data) return true;
            return false;
        }
        default: {
            return false;
        }
    }
}

export function hasAccess(obj: { [x: string]: number }, userType: string) {
    if (!Object.keys(obj)[0].includes("Table")) return false;
    const entityType = Object.keys(obj)[0].split("Table")[0];

    switch (entityType) {
        case Types.VENDOR: {
            if (
                userType === UserTypes.VENDOR ||
                userType === UserTypes.VENDOR_ADMIN
            ) {
                return true;
            }
            return false;
        }
        case Types.DEALER_SITE: {
            if (
                userType === UserTypes.DEALER ||
                userType === UserTypes.DEALER_ADMIN
            ) {
                return true;
            }
            return false;
        }
        case Types.BUYER_SITE: {
            if (
                userType === UserTypes.BUYER ||
                userType === UserTypes.BUYER_ADMIN
            ) {
                return true;
            }
            return false;
        }
        default: {
            return false;
        }
    }
}
