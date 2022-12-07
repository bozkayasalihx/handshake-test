import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import BuyerSite from "./BuyerSite";
import DealerSite from "./DealerSite";
import SuperEntity from "./SuperEntity";
import User from "./User";
import Vendor from "./Vendor";

@Entity("user_entity_relations")
export default class UserEntityRelation extends SuperEntity {
    @Column({
        type: "varchar",
        length: 240,
        name: "description",
        nullable: true,
    })
    public description: string;

    @ManyToOne(() => User)
    public user: User;

    @RelationId((UER: UserEntityRelation) => UER.user)
    @Column({ name: "user_id" })
    public userId: number;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: "vendor_table_ref_id" })
    public vendorTableRef: Vendor;

    @ManyToOne(() => BuyerSite)
    @JoinColumn({ name: "buyer_site_table_ref_id" })
    public buyerSiteTableRef: BuyerSite;

    @ManyToOne(() => DealerSite)
    @JoinColumn({ name: "dealer_site_table_ref_id" })
    public dealerSiteTableRef: DealerSite;
}
