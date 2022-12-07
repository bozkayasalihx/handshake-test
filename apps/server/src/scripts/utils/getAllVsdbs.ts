import {
    userEntityRelationOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import VendorTDealerSiteOperation from "../../services/VendorTDealerSiteOperation";

export async function getAllVdsbs(userId: number) {
    const data = await userEntityRelationOperation.repo
        .createQueryBuilder("uer")
        .leftJoin("uer.user", "user")
        .leftJoin("uer.vendor_table_ref", "vendor")
        .leftJoin("uer.buyer_site_table_ref", "bs")
        .leftJoin("uer.dealer_site_table_ref", "ds")
        .where("uer.user_id = :id", { id: userId })
        .select(["user.user_type", "vendor.id", "bs.id", "ds.id"])
        .execute();

    if (!data.length) return false;

    const [first] = data;
    const keys = Object.keys(first);
    const obj = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.includes("_id") && first[key]) {
            obj[key] = first[key];
            break;
        }
    }

    const vds = await VendorTDealerSiteOperation.repo
        .createQueryBuilder("vds")
        .where(`${Object.keys(obj)[0]} = ${Object.values(obj)[0]}`)
        .select("vds.id")
        .execute();

    if (!vds) return false;

    const { vds_id: vdsId } = vds[0];

    const vdsbs: Array<Record<string, any>> =
        await vendorToDealerSiteToBuyerSiteOperation.repo
            .createQueryBuilder("vdsbs")
            .leftJoin("vdsbs.dealer_route_users", "dru")
            .where("vds_rltn_id = :id", { id: vdsId })
            .select(["vdsbs.id"])
            .execute();

    if (!vdsbs) return false;

    const vdsbsIds = vdsbs.reduce((acc, cur) => {
        acc.push(cur.vdsbs_id);
        return acc;
    }, [] as Array<number>) as Array<number>;

    return vdsbsIds;
}
