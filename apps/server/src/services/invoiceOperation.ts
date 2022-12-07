import { Invoice, InvoiceInterface, InvoiceLine } from "../models";
import BaseService from "./BaseService";

export class InvoiceOperation extends BaseService {
    private Model = {
        Invoice,
        InvoiceLine,
    };

    public get invoiceRepo() {
        return this.source.getRepository(this.Model.Invoice);
    }

    public get invoiceInterfaceRepo() {
        return this.source.getRepository(InvoiceInterface);
    }

    public get invoiceLineRepo() {
        return this.source.getRepository(this.Model.InvoiceLine);
    }

    public createInvoice(params: Partial<Invoice>) {
        return this.invoiceRepo.insert(params);
    }

    public createInvoiceLine(params: Partial<InvoiceLine>) {
        return this.invoiceLineRepo.insert({ ...params });
    }

    public createInvoiceInterface(params: Partial<InvoiceInterface>) {
        return this.invoiceInterfaceRepo.insert({ ...params });
    }

    public async hasInvoice(params: { invoice_no: string; vdsbs_id: number }) {
        // "invoice_no", "vdsbs_id"
        try {
            const resp: [{ in_vdsbs_id: number; in_invoice_no: string }] =
                await this.invoiceRepo
                    .createQueryBuilder("in")
                    .where(
                        "in.invoice_no :invoice_no AND in.vdsbs_id = :vdsbs_id",
                        {
                            invoice_no: params.invoice_no,
                            vdsbs_id: params.vdsbs_id,
                        }
                    )
                    .select(["in.vdsbs_id", "in.invoice_no"])
                    .execute();

            return resp[0];
        } catch (err) {
            return null;
        }
    }
}

export default new InvoiceOperation();
