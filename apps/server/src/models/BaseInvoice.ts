import { Column } from "typeorm";
import { FileRecordType } from "../types";
import SuperEntity from "./SuperEntity";

export default abstract class BaseInvoice extends SuperEntity {
    @Column({ name: "record_type", enum: FileRecordType })
    public recordType: FileRecordType;

    @Column({ name: "invoice_no", length: 30 })
    public invoiceNo: string;

    @Column({ name: "vdsbs_id" })
    public vdsbsId: number;

    @Column({ name: "invoice_date", type: "timestamp", default: null })
    public invoiceDate: Date;

    @Column({ name: "due_date", type: "timestamp", default: null })
    public dueDate: Date;

    @Column({ name: "amount", type: "varchar", length: 20 })
    public amount: string;

    @Column({ name: "currency", length: 3, type: "varchar" })
    public currency: string;

    @Column({ name: "line_no", length: 3, type: "varchar" })
    public lineNo: string;

    @Column({ name: "erro_desc", length: 500 })
    public errorDesc: string;
}
