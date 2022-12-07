import httpStatus from "http-status";
import { Deposit, DepositLine, Payment } from "../../models";
import DatabaseTransaction from "../../scripts/transection/databaseTransection";
import { paymentOperation, productOperation } from "../../services";
import {
    Currency,
    InvoicedStatusType,
    PaymentType,
    TypedRequest,
    TypedResponse,
} from "../../types";

/**
 *
 * data type
 * {
 *                  vdsbsdId: int, currency: "USD", totalAmount: 50.000, lines: [
 *                                  {productCode: ..., productName: ..., unitPrice: ..., productQuantity: ..., amount ...},
 *                                  {productCode: ..., productName: ..., unitPrice: ..., productQuantity: ..., amount ...}
 *                                  {productCode: ..., productName: ..., unitPrice: ..., productQuantity: ..., amount ...}
 *                                  {productCode: ..., productName: ..., unitPrice: ..., productQuantity: ..., amount ...}
 *                                  {productCode: ..., productName: ..., unitPrice: ..., productQuantity: ..., amount ...} *                             ]
 * }
 */

export type DepositLineType = Pick<
    DepositLine,
    | "amount"
    | "productCode"
    | "productName"
    | "productQuantity"
    | "unitPrice"
    | "currency"
>;
export type DepositType = {
    vdsbsId: number;
    vendorId: number;
    currency: Currency;
    amount: number;
    lines: Array<DepositLineType>;
};

export default async function createDeposit(
    req: TypedRequest<DepositType>,
    res: TypedResponse
) {
    const { user } = req;
    const { amount, currency, vdsbsId, vendorId, lines } = req.body;
    await DatabaseTransaction.transection(async (queryRunner) => {
        const deposit = Deposit.create({
            amount,
            currency,
            vdsbsId,
            senderUserType: user.userType,
            created_by: user,
            updated_by: user,
        });

        const savedDeposit = await queryRunner.manager.save(Deposit, deposit);

        const temp: Array<DepositLine> = [];

        for (let i = 0; i < lines.length; i++) {
            await productOperation.repo
                .createQueryBuilder("p")
                .connection.query(
                    `select count(id) from products where vendor_id = '${vendorId}' and product_code = '${lines[i].productCode}'`
                );
            temp.push(
                DepositLine.create({
                    ...lines[i],
                    depositId: deposit.id,
                    created_by: user,
                    updated_by: user,
                })
            );
        }

        await queryRunner.manager.save(DepositLine, temp);

        return res.status(httpStatus.CREATED).json({
            message: "operation successful",
        });
    }, res);
}
