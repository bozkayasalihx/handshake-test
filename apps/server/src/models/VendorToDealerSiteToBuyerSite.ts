import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from "typeorm";
import {
    Advance,
    BuyerSite,
    DealerRouteUser,
    Deposit,
    Invoice,
    Payment,
    PaymentApprovalHeader,
    PaymentMatches,
    PaymentSchedule,
    VendorToDealerSite,
} from "./index";
// eslint-disable-next-line import/no-cycle
import SuperEntity from "./SuperEntity";

@Entity("vdsbs_relations")
@Index(["buyerSiteId", "vds_rltn_id"])
export default class VendorToDealerSiteToBuyerSite extends SuperEntity {
    /** relations */
    @OneToOne(() => BuyerSite)
    @JoinColumn({ name: "buyer_site_id" })
    @Index({ unique: true })
    public buyerSite: BuyerSite;

    @Column()
    public buyerSiteId: number;

    @ManyToOne(() => VendorToDealerSite, (vToDS) => vToDS.vToDsBs)
    @JoinColumn({ name: "vds_rltn_id" })
    public vToDS: VendorToDealerSite;

    @Column()
    public vds_rltn_id: number;

    @OneToMany(() => Invoice, (invoices) => invoices.vdsbs)
    public invoices: Array<Invoice>;

    @OneToMany(() => Payment, (payment) => payment.vdsbs)
    public payments: Array<Payment>;

    @OneToMany(() => PaymentMatches, (pm) => pm.vdsbs)
    public paymentMatches: Array<PaymentMatches>;

    @OneToMany(() => Deposit, (deposit) => deposit.vdsbs)
    public deposits: Array<Deposit>;

    @OneToMany(() => Advance, (advance) => advance.vdsbs)
    public advances: Array<Advance>;

    @OneToMany(
        () => DealerRouteUser,
        (dealerUserRoute) => dealerUserRoute.vdsbs
    )
    public dealerRouteUsers: Array<DealerRouteUser>;

    @OneToMany(() => PaymentSchedule, (ps) => ps.vdsbs)
    public paymentSchedules: Array<PaymentSchedule>;

    @OneToMany(() => PaymentApprovalHeader, (pah) => pah.vdsbs)
    public paymentApprovals: Array<PaymentApprovalHeader>;
}
