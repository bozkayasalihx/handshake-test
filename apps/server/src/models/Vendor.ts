import { Column, Entity, OneToMany } from "typeorm";
import { Product, VendorRegion, VendorToDealerSite } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("vendors")
export default class Vendor extends SuperEntity {
    //* * Properties */
    @Column({
        type: "varchar",
        length: 240,
        name: "name",
        unique: true,
    })
    public name: string;

    @Column({
        type: "varchar",
        length: 20,
        name: "tax_no",
        unique: true,
    })
    public taxNo: string;

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

    @Column({ length: 250, nullable: false, unique: true })
    public externalVCode: string;

    /* Releations */
    @OneToMany(
        () => VendorToDealerSite,
        (vendorToDealerSite) => vendorToDealerSite.vendor
    )
    public vendorToDealerSite: Array<VendorToDealerSite>;

    @OneToMany(() => VendorRegion, (vendorRegion) => vendorRegion.vendor)
    public vendorRegions: Array<VendorRegion>;

    @OneToMany(() => Product, (product) => product.vendor)
    public products: Array<Product>;
}
