import { Column, Entity, Index, ManyToOne, RelationId } from "typeorm";
import { Dealer } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("dealer_sites")
@Index(["externalVCode", "externalDSCode"], { unique: true })
export default class DealerSite extends SuperEntity {
    /** Properites */
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

    /** Releations */
    @ManyToOne(() => Dealer, (dealer) => dealer.dealerSites)
    public dealer: Dealer;

    @RelationId((dealerSite: DealerSite) => dealerSite.dealer)
    @Column({ name: "dealer_id", nullable: false })
    public dealerId: number;
}
