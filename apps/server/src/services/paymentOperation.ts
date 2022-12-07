import {
    Payment,
    PaymentMatches,
    PaymentSchedule,
    PaymentScheduleInterface,
} from "../models";
import BaseService from "./BaseService";

export class PaymentOperation extends BaseService {
    private Models = {
        Payment,
        PaymentMatches,
        PaymentSchedule,
        PaymentScheduleInterface,
    };

    public get paymentRepo() {
        return this.source.getRepository(this.Models.Payment);
    }

    public get PSIRepo() {
        return this.source.getRepository(this.Models.PaymentScheduleInterface);
    }

    public get psRepo() {
        return this.source.getRepository(this.Models.PaymentSchedule);
    }

    public get pmRepo() {
        return this.source.getRepository(this.Models.PaymentMatches);
    }

    public createPSI(params: Partial<PaymentScheduleInterface>) {
        return this.PSIRepo.insert({ ...params });
    }

    public createPayment(params: Partial<Payment>) {
        return this.paymentRepo.insert({ ...params });
    }

    public createPS(params: Partial<PaymentSchedule>) {
        return this.psRepo.insert({ ...params });
    }

    public createPM(params: Partial<PaymentMatches>) {
        return this.pmRepo.insert({ ...params });
    }

    public async removeNullable() {
        try {
            const resp: [{ ps_id: number }] = await this.psRepo
                .createQueryBuilder("ps")
                .where("ps.due_amount = :zero AND ps.vdsbs_id IS NOT NULL", {
                    zero: 0,
                })
                .select("ps.id")
                .execute();

            return resp[0].ps_id;
        } catch (err) {
            return null;
        }
    }
}
export default new PaymentOperation();
