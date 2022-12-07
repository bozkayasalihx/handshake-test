import {
    Column, Entity,
    JoinColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import {
    Currency,
    PaymentApprovalStatus,
    PaymentType,
    UserTypes
} from "../types";
import ParentEntity from "./ParentEntity";
import PaymentApprovalLines from "./PaymentApprovalLine";
import User from "./User";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("payment_approval_header")
export default class PaymentApprovalHeader extends ParentEntity {
    @Column({
        enum: PaymentApprovalStatus,
        default: PaymentApprovalStatus.PENDING,
    })
    public status: PaymentApprovalStatus;

    @Column()
    public type: PaymentType;

    @Column()
    public amount: number;

    @Column({ enum: Currency, default: Currency.TRY })
    public currency: Currency;

    @Column({ nullable: true })
    public approvalDate: Date;

    @OneToMany(() => PaymentApprovalLines, (pal) => pal.paymentHeader)
    public lines: Array<PaymentApprovalLines>;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "approved_by_id" })
    public approvedBy: User;

    @Column({ nullable: true })
    public approvedById: number;

    @Column({ enum: UserTypes, nullable: false })
    public senderUserType: UserTypes;

    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.paymentApprovals
    )
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @Column()
    public vdsbsId: number;
}
