import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PaymentStatusType } from "../types";
import {
    Invoice,
    PaymentMatches,
    VendorToDealerSiteToBuyerSite,
} from "./index";
import ParentEntity from "./ParentEntity";

@Entity("payment_schedules")
export default class PaymentSchedule extends ParentEntity {
    @ManyToOne(() => Invoice, (invoice) => invoice.paymentSchedules)
    @JoinColumn({ name: "invoice_id" })
    public invoice: Invoice;

    @Column({ name: "line_no", nullable: true })
    public lineNo: number;

    @Column({ type: "date", name: "due_date" })
    public dueDate: Date;

    @Column({ type: "real", nullable: false, default: 0 })
    public dueAmount: number;

    @Column({ type: "real", nullable: false, default: 0 })
    public remainedAmount: number;

    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({
        type: "enum",
        enum: PaymentStatusType,
        default: PaymentStatusType.NO_PAYMENT,
    })
    public paymentStatus: PaymentStatusType;

    /** relations */
    @OneToMany(() => PaymentMatches, (pm) => pm.paymentSchedule)
    public paymentMatches: Array<PaymentMatches>;

    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.paymentSchedules
    )
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @Column({ name: "vdsbs_id" })
    public vdsbsId: number;
}
