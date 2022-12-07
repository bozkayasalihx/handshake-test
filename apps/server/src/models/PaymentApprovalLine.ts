import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import ParentEntity from "./ParentEntity";
import PaymentApprovalHeader from "./PaymentApprovalHeader";

@Entity("payment_approval_lines")
export default class PaymentApprovalLines extends ParentEntity {
    @Column()
    public paymentScheduleId: number;

    @ManyToOne(() => PaymentApprovalHeader)
    @JoinColumn({ name: "payment_approval_id" })
    public paymentHeader: PaymentApprovalHeader;

    @Column()
    public paymentApprovalHeaderId: number;
}
