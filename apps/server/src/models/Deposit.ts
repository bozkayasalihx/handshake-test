import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Currency, DepositStatusType, UserTypes } from "../types";
import { DepositLine, User, VendorToDealerSiteToBuyerSite } from "./index";
import ParentEntity from "./ParentEntity";

@Entity("deposits")
export default class Deposit extends ParentEntity {
    @Column({ type: "real" })
    public amount: number;

    @Column({ length: 3, type: "varchar", default: Currency.TRY })
    public currency: Currency;

    @Column({
        type: "enum",
        enum: DepositStatusType,
        default: DepositStatusType.PENDING_APPROVAL,
    })
    public status: DepositStatusType;

    @Column({ type: "timestamp", default: null })
    public approvalDate: Date;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "approved_by_id" })
    public approvedBy: User;

    @Column({ nullable: true })
    public approvedById: number;

    /** relations */
    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.deposits)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @Column({ enum: UserTypes, nullable: false })
    public senderUserType: UserTypes;

    @Column()
    public vdsbsId: number;

    @OneToMany(() => DepositLine, (depositLine) => depositLine.deposit)
    public depositLines: Array<DepositLine>;
}
