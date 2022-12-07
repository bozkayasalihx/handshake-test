import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Currency, InvoicedStatusType, PaymentType } from "../types";
import {
    ParentEntity,
    PaymentMatches,
    VendorToDealerSiteToBuyerSite,
} from "./index";

@Entity("payments")
export default class Payments extends ParentEntity {
    @Column({ type: "enum", enum: PaymentType, default: PaymentType.CASH })
    public paymentType: PaymentType;

    @Column({ nullable: true })
    public referece_id: number;

    @Column({ type: "real" })
    public originalAmount: number;

    @Column({ type: "real" })
    public remainedAmount: number;

    @Column({ type: "varchar", length: 3, default: Currency.TRY })
    public currency: Currency;

    @Column({ type: "timestamp", nullable: true })
    public effectiveDate: Date;

    @Column({
        type: "enum",
        enum: InvoicedStatusType,
        default: InvoicedStatusType.NO_INVOICE,
    })
    public invoicedStatus: InvoicedStatusType;

    /** relations */
    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.payments,
    )
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @Column()
    public vdsbsId: number;

    @OneToMany(() => PaymentMatches, (pm) => pm.payments)
    public paymentMatches: Array<PaymentMatches>;
}
