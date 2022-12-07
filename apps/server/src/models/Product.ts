import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Currency } from "../types";
import { Vendor } from "./index";
import ParentEntity from "./ParentEntity";
@Entity("products")
@Index(["vendorId", "productCode"], { unique: true})
export default class Product extends ParentEntity {
    @Column({ length: 30 })
    public productCode: string;

    @Column({ length: 150 })
    public productName: string;

    @Column({ type: "real" })
    public unitPrice: bigint;

    @Column({ enum: Currency, default: Currency.TRY })
    public currency: Currency;

    // relations
    @ManyToOne(() => Vendor, (vendor) => vendor.products)
    @JoinColumn({ name: "vendor_id" })
    public vendor: Vendor;

    @Column()
    public vendorId: number;
}
