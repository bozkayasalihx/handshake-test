import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    RelationId,
} from "typeorm";
import DealerSite from "./DealerSite";
import { Vendor, VendorToDealerSiteToBuyerSite } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("vds_relations")
@Index(["vendorId", "dealerSiteId"], { unique: true })
export default class VendorToDealerSite extends SuperEntity {
    /** Relations */
    @ManyToOne(() => Vendor, (vendor) => vendor.vendorToDealerSite)
    public vendor: Vendor;

    @OneToOne(() => DealerSite)
    @JoinColumn({ name: "dealer_site_id" })
    public dealerSite: DealerSite;

    @OneToMany(() => VendorToDealerSiteToBuyerSite, (vToDsBs) => vToDsBs.vToDS)
    public vToDsBs: Array<VendorToDealerSiteToBuyerSite>;

    /** Referans */
    @RelationId((vToDS: VendorToDealerSite) => vToDS.vendor)
    @Column({ name: "vendor_id" })
    public vendorId: number;

    @RelationId((vToDS: VendorToDealerSite) => vToDS.dealerSite)
    @Column({ name: "dealer_site_id" })
    public dealerSiteId: number;
}
