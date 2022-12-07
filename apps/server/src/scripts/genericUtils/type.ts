import { InvoiceInterface, PaymentScheduleInterface } from "../../models";

export type OmittedInvoice = Omit<
    InvoiceInterface,
    "updated_at" | "created_at" | "updated_by" | "created_by"
>;

export type OmmitedPaymentSchedule = Omit<
    PaymentScheduleInterface,
    "updated_at" | "created_at" | "updated_by" | "created_by"
>;
