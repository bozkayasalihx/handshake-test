import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Invoice from "./Invoice";
import ParentEntity from "./ParentEntity";

@Entity("invoice_lines")
export default class InvoiceLine extends ParentEntity {
    @Column({ type: "int", nullable: true })
    public lineNo: number | undefined;

    @Column({ type: "real" })
    public amount: number;

    @Column({ length: 3 })
    public currency: string;

    @Column({ name: "item_quantity", nullable: true })
    public itemQuantity: number;

    @Column({ length: 20, name: "item_uom", nullable: true })
    public itemUom: string;

    @Column({ length: 100, nullable: true, name: "item_description" })
    public itemDescription: string;

    // relations
    @ManyToOne(() => Invoice, (invoices) => invoices.invoicesLines)
    @JoinColumn({ name: "invoice_id" })
    public invoice: Invoice;

    @Column()
    public invoice_id: number;
}
