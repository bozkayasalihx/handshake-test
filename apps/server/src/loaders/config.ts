import { InvoiceInterface, PaymentScheduleInterface } from "../models";
import { appDataSource } from "./database";

export default function config() {
    const connectDb = async () => {
        await appDataSource.initialize();
        await appDataSource
            .getRepository(InvoiceInterface)
            .query(
                "CREATE SEQUENCE IF NOT EXISTS invoice_file_process_id INCREMENT 1 START 1;"
            );
        await appDataSource
            .getRepository(PaymentScheduleInterface)
            .query(
                "CREATE SEQUENCE IF NOT EXISTS ps_file_process_id INCREMENT 1 START 1;"
            );
    };

    return Promise.all([connectDb()]);
}
