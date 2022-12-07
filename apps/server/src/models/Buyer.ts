import { Column, Entity, OneToMany } from "typeorm";
import { BuyerSite } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("buyers")
export default class Buyer extends SuperEntity {
    /** Properties */
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

    @Column({ default: null, name: "attribute1" })
    public attribute1: string;

    @Column({ default: null, name: "attribute2" })
    public attribute2: string;

    @Column({ default: null, name: "attribute3" })
    public attribute3: string;

    @Column({ default: null, name: "attribute4" })
    public attribute4: string;

    @Column({ default: null, name: "attribute5" })
    public attribute5: string;

    /** Relations */
    @OneToMany(() => BuyerSite, (buyerSite) => buyerSite.buyer)
    public buyerSites: Array<BuyerSite>;
}
