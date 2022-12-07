import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Vendor } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("vendor_regions")
export default class VendorRegion extends SuperEntity {
    //* * Properties */

    @Column({
        type: "varchar",
        length: 240,
        name: "name",
        unique: true,
    })
    public name: string;

    @Column({ nullable: true, name: "attribute1" })
    public attribute1: string;

    @Column({ nullable: true, name: "attribute2" })
    public attribute2: string;

    @Column({ nullable: true, name: "attribute3" })
    public attribute3: string;

    @Column({ nullable: true, name: "attribute4" })
    public attribute4: string;

    @Column({ nullable: true, name: "attribute5" })
    public attribute5: string;

    /** relations */
    @ManyToOne(() => Vendor, (vendor) => vendor.vendorRegions)
    @Index("vendor_id")
    @JoinColumn({ name: "vendor_id" })
    public vendor: Vendor;
}
