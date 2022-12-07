import { vendorToDealerSiteToBuyerSiteOperation } from "../../services";

export default async function validateIds(ids: Array<number>) {
    let parens = "(";
    for (let i = 0; i < ids.length; i++) {
        if (i === ids.length - 1) parens += `${ids[i]})`;
        else parens += `${ids[i]},`;
    }
    try {
        const containedids = await vendorToDealerSiteToBuyerSiteOperation.repo
            .createQueryBuilder("vdsbs")
            .where(`vdsbs.id IN ${parens}`)
            .select("COUNT(*)")
            .execute();

        return parseInt(containedids[0].count, 10) === ids.length
            ? true
            : false;
    } catch (err) {
        //
        return false;
    }
}
