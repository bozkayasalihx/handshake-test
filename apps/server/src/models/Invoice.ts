import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { HasPs, InvoiceStatusType } from "../types";
import {
    InvoiceInterface,
    PaymentSchedule,
    VendorToDealerSiteToBuyerSite,
} from "./index";
import InvoiceLine from "./InvoiceLine";
import ParentEntity from "./ParentEntity";

@Entity("invoices")
@Index(["invoiceNo", "vdsbs_id"], { unique: true })
export default class Invoice extends ParentEntity {
    /** Properties */
    @Column({ type: "varchar", length: 30 })
    public invoiceNo: string;

    @Column({ type: "date" })
    public invoiceDate: Date;

    @Column({ type: "real" })
    public amount: number;

    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({ type: "date" })
    public dueDate: Date;

    @Column({ enum: HasPs, default: HasPs.NO })
    public has_ps: HasPs;

    @Column("int", { array: true, default: [] })
    public refUserList: Array<number>;

    @Column({
        type: "enum",
        enum: InvoiceStatusType,
        default: InvoiceStatusType.NEW,
    })
    public status: InvoiceStatusType;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute1: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute2: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute3: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute4: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute5: string;

    /** RElations */
    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.invoices)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @ManyToOne(() => InvoiceInterface, (invoiceIn) => invoiceIn.invoice)
    @JoinColumn({ name: "ref_intf_id" })
    public invoiceInterfaces: InvoiceInterface;

    @Column()
    public ref_intf_id: number;

    @Column()
    public vdsbs_id: number;

    @OneToMany(() => InvoiceLine, (invoicesLine) => invoicesLine.invoice, {
        nullable: false,
    })
    public invoicesLines: Array<InvoiceLine>;

    @OneToMany(
        () => PaymentSchedule,
        (paymentSchedule) => paymentSchedule.invoice
    )
    public paymentSchedules: Array<PaymentSchedule>;
}
