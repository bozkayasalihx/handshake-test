import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AdvanceStatusType, AdvanceType, Currency, UserTypes } from "../types";
import { User, VendorToDealerSiteToBuyerSite } from "./index";
import ParentEntity from "./ParentEntity";

@Entity("advances")
export default class Advance extends ParentEntity {
    @Column({ type: "enum", enum: AdvanceType, default: AdvanceType.CASH })
    public advanceType: AdvanceType;

    @Column({ type: "real" })
    public amount: number;

    @Column({ type: "varchar", length: 3, default: Currency.TRY })
    public currency: Currency;

    @Column({
        type: "enum",
        enum: AdvanceStatusType,
        default: AdvanceStatusType.PENDING_APPROVAL,
    })
    public status: AdvanceStatusType;

    @Column({ type: "timestamp", nullable: true })
    public approvalDate: Date;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "approved_by_id" })
    public approvedBy: User;

    /** relations */
    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.advances)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @Column({ enum: UserTypes, nullable: false })
    public senderUserType: UserTypes;

    @Column()
    public vdsbsId: number;

    @Column({ nullable: true })
    public approvedById: number;
}
