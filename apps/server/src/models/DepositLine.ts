import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Currency } from "../types";
import { Deposit } from "./index";
import ParentEntity from "./ParentEntity";

@Entity("deposit_lines")
export default class DepositLine extends ParentEntity {
    @Column({ length: 30 })
    public productCode: string;

    @Column({ length: 150 })
    public productName: string;

    @Column({ type: "real" })
    public unitPrice: bigint;

    @Column()
    public productQuantity: number;

    @Column({ type: "real" })
    public amount: number;

    @Column({ enum: Currency, default: Currency.TRY })
    public currency: Currency;

    @ManyToOne(() => Deposit, (deposit) => deposit.depositLines)
    @JoinColumn({ name: "deposit_id" })
    public deposit: Deposit;

    @Column()
    public depositId: number;
}
