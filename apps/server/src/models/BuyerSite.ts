import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Buyer } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("buyer_sites")
@Index(["externalVCode", "externalDSCode", "externalBSCode"], {
    unique: true,
})
export default class BuyerSite extends SuperEntity {
    /** Properties */
    @Column({ name: "name", unique: true })
    public name: string;

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

    @Column({ length: 50 })
    public externalVCode: string;

    @Column({ length: 50 })
    public externalDSCode: string;

    @Column({ length: 50 })
    public externalBSCode: string;

    /** Relations */
    @ManyToOne(() => Buyer, (buyer) => buyer.buyerSites)
    @Index("buyer_id")
    @JoinColumn({ name: "buyer_id" })
    public buyer: Buyer;

    // @RelationId((bs: BuyerSite) => bs.buyer)
    // public buyer_id: number;

    @Column()
    public buyer_id: number;
}
