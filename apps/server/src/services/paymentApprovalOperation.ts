import { PaymentApprovalHeader, PaymentApprovalLine } from "../models";
import BaseService from "./BaseService";

export class PaymentApprovalOperation extends BaseService {
    private Model = { PaymentApprovalHeader, PaymentApprovalLine };

    public get headerRepo() {
        return this.source.getRepository(this.Model.PaymentApprovalHeader);
    }

    public get lineRepo() {
        return this.source.getRepository(this.Model.PaymentApprovalLine);
    }

    public createPaymentApproval(params: Partial<PaymentApprovalHeader>) {
        return this.headerRepo.insert(params);
    }

    public updatePaymentApproval(params: Partial<PaymentApprovalHeader>) {
        return this.headerRepo.save(params);
    }

    public createPaymentApprovalLine(params: Partial<PaymentApprovalLine>) {
        return this.lineRepo.insert(params);
    }

    public updatePaymentApprovalLine(params: Partial<PaymentApprovalLine>) {
        return this.lineRepo.save(params);
    }
}

export default new PaymentApprovalOperation();
