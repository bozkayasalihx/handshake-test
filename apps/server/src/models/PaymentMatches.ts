import { customEventEmitter } from "../loaders";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Currency } from "../types";
import {
    Payment,
    PaymentSchedule,
    VendorToDealerSiteToBuyerSite,
} from "./index";
import SuperEntity from "./SuperEntity";

@Entity("payment_matches")
export default class PaymentMatches extends SuperEntity {
    @Column({ enum: Currency, default: Currency.TRY })
    public currency: Currency;

    @Column({ type: "real" })
    public matchedAmount: number;
    /** Relations */

    @ManyToOne(() => PaymentSchedule, (ps) => ps.paymentMatches)
    @JoinColumn({ name: "payment_schedule_id" })
    public paymentSchedule: PaymentSchedule;

    @ManyToOne(() => Payment, (payments) => payments.paymentMatches)
    @JoinColumn({ name: "payment_id" })
    public payments: Payment;

    @Column()
    public paymentId: number;

    @Column()
    public paymentScheduleId: number;

    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.paymentMatches
    )
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @Column()
    public vdsbsId: number;
}
