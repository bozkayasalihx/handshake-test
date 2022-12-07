import { UserEntityRelation } from "../../models";
import {
    buyerSiteOperation,
    dealerOperation,
    vendorOperation,
} from "../../services";

class Wrapper {
    public getReleventTable(uer: UserEntityRelation) {
        if (uer.buyerSiteTableRef) {
            return buyerSiteOperation.repo.findOne({
                where: { id: uer.buyerSiteTableRef.id },
            });
        }
        if (uer.dealerSiteTableRef) {
            return dealerOperation.repo.findOne({
                where: { id: uer.dealerSiteTableRef.id },
            });
        }
        if (uer.vendorTableRef) {
            return vendorOperation.repo.findOne({
                where: { id: uer.vendorTableRef.id },
            });
        }

        return false;
    }
}

export default new Wrapper();
