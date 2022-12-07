import { Column, Entity } from "typeorm";
import { Currency, FileStatusType, LineStatusType } from "../types";
import ParentEntity from "./ParentEntity";

@Entity("ps_interface")
export default class PaymentScheduleInteface extends ParentEntity {
    @Column({ type: "int", name: "file_process_id" })
    public file_process_id: number;

    @Column({ type: "varchar", name: "file_name", length: 100 })
    public file_name: string;

    @Column({
        type: "enum",
        enum: FileStatusType,
        default: FileStatusType.VALIDATED,
    })
    public file_status: FileStatusType;

    @Column({ type: "varchar", length: 30 })
    public invoice_no: string;

    @Column({
        name: "line_no",
        length: 3,
        type: "varchar",
        default: null,
    })
    public line_no: string;

    @Column({ name: "due_date", type: "varchar", default: null })
    public due_date?: string;

    @Column({ name: "amount", type: "varchar", length: 20, default: null })
    public amount: string;

    @Column({ type: "varchar", nullable: false })
    public external_v_code: string;

    @Column({ type: "varchar", nullable: false })
    public external_ds_code: string;

    @Column({ type: "varchar", nullable: false })
    public external_bs_code: string;

    @Column({
        name: "currency",
        length: 3,
        type: "varchar",
        default: Currency.TRY,
    })
    public currency: string;

    @Column({ type: "enum", enum: LineStatusType, default: LineStatusType.NEW })
    public line_status?: LineStatusType;

    @Column({ name: "error_desc", length: 500, default: null })
    public error_desc?: string;
}
