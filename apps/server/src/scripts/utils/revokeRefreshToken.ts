import { appDataSource } from "../../loaders";
import { InvoiceInterface, User } from "../../models";

export default async function revokeRefreshToken(userId: number) {
    try {
        await appDataSource
            .getRepository(User)
            .increment({ id: userId }, "tokenVersion", 1);
        return userId + 1;
    } catch (err) {
        return userId;
    }
}

type IName = "invoice_file_process_id" | "ps_file_process_id";

export async function increment(name: IName) {
    try {
        const value: [{ nextval: string }] = await appDataSource
            .getRepository(InvoiceInterface)
            .query(`SELECT nextval('${name}');`);
        return +value[0].nextval;
    } catch (err) {
        return 1;
    }
}
