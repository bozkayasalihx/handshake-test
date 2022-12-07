import Joi from "joi";
import { IAdvance } from "../controllers/advance/createAdvance";
import { IListAdvance } from "../controllers/advance/listAdvances";
import { IUpdateAdvance } from "../controllers/advance/updateAdvance";
import { IBuyer } from "../controllers/buyer/createBuyer";
import { IBuyerSite } from "../controllers/buyer/createBuyerSite";
import { IDealer } from "../controllers/dealer/createDealer";
import { IDealerSite } from "../controllers/dealer/createDealerSite";
import {
    DepositLineType,
    DepositType,
} from "../controllers/deposit/createDeposit";
import { IDepositType } from "../controllers/deposit/getDeposits";
import { UpdateDepositType } from "../controllers/deposit/updateDeposit";
import { IGetInvoice } from "../controllers/invoice/getInvoices";
import { IUpdateInvoice } from "../controllers/invoice/updateInvoices";
import { IListAvailablePS } from "../controllers/payment/listAvailablePS";
import { IListApprovals } from "../controllers/payment/listPaymentApprovals";
import { IApprovals } from "../controllers/payment/processApprovals";
import { IProcessPayment } from "../controllers/payment/processPayments";
import { IProduct } from "../controllers/product/createProduct";
import { IDealerRouteUser } from "../controllers/relations/createDealerRouteUser";
import { IUserEntityRelation } from "../controllers/relations/createUserEntityRelation";
import { IVDSBSRelations } from "../controllers/relations/createVdsbsRelations";
import { IVdsRelations } from "../controllers/relations/createVdsRelations";
import { IVendor } from "../controllers/vendor/createVendor";
import { IVendorRegion } from "../controllers/vendor/createVendorRegion";
import { UpdateVendor } from "../controllers/vendor/updateVendor";
import { UpdateVendorRegion } from "../controllers/vendor/updateVendorRegion";
import {
    AdvanceType,
    Currency,
    InvoiceStatusType,
    PaymentType,
    UserTypes,
} from "../types";

export interface ILogin {
    email: string;
    password: string;
}

const currencyType = Joi.valid(...Object.values(Currency)).required();
const depositLineObjectType = Joi.object<DepositLineType>({
    amount: Joi.number().required(),
    currency: currencyType,
    productCode: Joi.string().required(),
    productName: Joi.string().required(),
    productQuantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
});

export interface IRegister {
    username: string;
    email: string;
    password: string;
    userType: UserTypes;
    tckn: string;
    mobile: string;
    startDate: Date;
    endDate: Date;
}

export interface Options {
    attribute1: string;
    attribute2: string;
    attribute3: string;
    attribute4: string;
    attribute5: string;
}

export const dateOptions = {
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
};

const options = {
    attribute1: Joi.string().optional(),
    attribute2: Joi.string().optional(),
    attribute3: Joi.string().optional(),
    attribute4: Joi.string().optional(),
    attribute5: Joi.string().optional(),
};

class ValidationSchema {
    public loginValidation() {
        return Joi.object<ILogin>({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(5),
        });
    }

    public registerValidation() {
        return Joi.object<IRegister>({
            username: Joi.string().min(3).required(),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(5),
            userType: Joi.valid(...Object.values(UserTypes)).required(),
            mobile: Joi.string().required().min(10).max(11),
            tckn: Joi.string().required().min(11).max(11),
            ...dateOptions,
        });
    }

    public resetPasswordValidation() {
        return Joi.object<{ email: string }>({
            email: Joi.string().required().email(),
        });
    }

    public createVendorValidation() {
        return Joi.object<IVendor>({
            name: Joi.string().required().min(3),
            taxNo: Joi.string().required().min(3),
            externalVCode: Joi.string().required().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public updateVendorValidation() {
        return Joi.object<UpdateVendor>({
            id: Joi.number().required(),
            name: Joi.string().optional().min(3),
            taxNo: Joi.string().optional().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public createVendorRegionValidation() {
        return Joi.object<IVendorRegion>({
            name: Joi.string().required().min(2),
            vendorId: Joi.number().required(),
            ...options,
            ...dateOptions,
        });
    }

    public updateVendorRegion() {
        return Joi.object<UpdateVendorRegion>({
            id: Joi.number().required(),
            name: Joi.string().optional().min(2),
            vendorId: Joi.number().optional(),
            ...options,
            ...dateOptions,
        });
    }

    public createBuyerValidation() {
        return Joi.object<IBuyer>({
            name: Joi.string().required().min(3),
            taxNo: Joi.number().required().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public updateBuyerValidation() {
        return Joi.object({
            id: Joi.number().required(),
            name: Joi.string().optional().min(3),
            taxNo: Joi.number().optional().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public createBuyerSiteValidation() {
        return Joi.object<IBuyerSite>({
            name: Joi.string().required().min(3),
            buyerId: Joi.number().required(),
            externalVCode: Joi.string().required(),
            externalDSCode: Joi.string().required(),
            externalBSCode: Joi.string().required(),
            ...options,
            ...dateOptions,
        });
    }

    public updateBuyerSiteValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            id: Joi.number().required(),
            buyerId: Joi.number().optional(),
            ...options,
            ...dateOptions,
        });
    }

    public createDealerValidation() {
        return Joi.object<IDealer>({
            name: Joi.string().required().min(3),
            taxNo: Joi.number().required().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public updateDealerValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            taxNo: Joi.number().optional().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public createDealerSiteValidation() {
        return Joi.object<IDealerSite>({
            name: Joi.string().required().min(3),
            dealerId: Joi.number().required(),
            externalVCode: Joi.string().required().min(3),
            externalDSCode: Joi.string().required().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public updateDealerSiteValidation() {
        return Joi.object<Partial<IDealerSite>>({
            name: Joi.string().optional().min(3),
            dealerId: Joi.number().optional(),
            externalDSCode: Joi.string().optional().min(3),
            externalVCode: Joi.string().optional().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public createVdsValidation() {
        return Joi.object<IVdsRelations>({
            vendorId: Joi.number().required(),
            dealerSiteId: Joi.number().required(),
            description: Joi.string().optional(),
            ...dateOptions,
        });
    }

    public createVdsbsValidation() {
        return Joi.object<IVDSBSRelations>({
            vdsRltnId: Joi.number().required(),
            buyerSiteId: Joi.number().required(),
            description: Joi.string().optional(),
            ...dateOptions,
        });
    }

    public createPasswordValidation() {
        return Joi.object<{ token: string; newPassword: string }>({
            token: Joi.string().required().min(10),
            newPassword: Joi.string().required().min(5),
            ...dateOptions,
        });
    }

    public createUserEntityValidation() {
        return Joi.object<IUserEntityRelation>({
            buyerSiteTableRef: Joi.alternatives()
                .try(Joi.valid(null), Joi.number())
                .required(),
            dealerSiteTableRef: Joi.alternatives()
                .try(Joi.valid(null), Joi.number())
                .required(),
            vendorTableRef: Joi.alternatives()
                .try(Joi.valid(null), Joi.number())
                .required(),
            description: Joi.string().optional(),
            userId: Joi.number().required(),
            ...dateOptions,
        });
    }

    public createDealerRouteUser() {
        return Joi.object<IDealerRouteUser>({
            description: Joi.string().optional(),
            userId: Joi.number().required(),
            vdsbsId: Joi.number().required(),
            ...dateOptions,
        });
    }

    public createDeposit() {
        return Joi.object<DepositType>({
            ...dateOptions,
            amount: Joi.number().required(),
            currency: currencyType,
            vdsbsId: Joi.number().required(),
            vendorId: Joi.number().required(),
            lines: Joi.array().items(depositLineObjectType).required(),
        });
    }

    public updateDeposit() {
        return Joi.object<UpdateDepositType>({
            vdsbsId: Joi.number().required(),
            isApproved: Joi.valid(true, false).required(),
            ids: Joi.array().items(Joi.number().required()),
        });
    }

    public getDeposits() {
        return Joi.object<IDepositType>({
            vdsbsId: Joi.number().required(),
        });
    }

    public createProduct() {
        return Joi.object<IProduct>({
            currency: currencyType,
            productName: Joi.string().required(),
            productCode: Joi.string().required(),
            unitPrice: Joi.string().required(),
            vendorId: Joi.number().required(),
        });
    }

    public updateProduct() {
        return Joi.object<IProduct>({
            currency: currencyType,
            productName: Joi.string().optional(),
            unitPrice: Joi.string().optional(),
            vendorId: Joi.number().optional(),
        });
    }

    public createAdvance() {
        return Joi.object<IAdvance>({
            advanceType: Joi.valid(...Object.values(AdvanceType)).required(),
            amount: Joi.number().required(),
            currency: Joi.valid(...Object.values(Currency)).optional(),
            vdsbsId: Joi.number().required(),
        });
    }

    public updateAdvance() {
        return Joi.object<IUpdateAdvance>({
            isApproved: Joi.valid(true, false).required(),
            advanceIds: Joi.array().items(Joi.number().required()).required(),
        });
    }

    public getUserAccess() {
        return Joi.object<{ userId: number }>({
            userId: Joi.number().required(),
        });
    }

    public getInvoice() {
        return Joi.object<IGetInvoice>({
            vdsbs_id: Joi.number().required(),
        });
    }

    public updateInvoice() {
        return Joi.object<IUpdateInvoice>({
            invoice: Joi.array().items(
                Joi.object({ invoice_id: Joi.number().required() })
            ),
            proven_type: Joi.valid(
                ...Object.values([
                    InvoiceStatusType.APPROVED,
                    InvoiceStatusType.CANCELLED,
                    InvoiceStatusType.REJECTED,
                    InvoiceStatusType.PENDING_APPROVAL,
                ])
            ).required(),
        });
    }

    public listAdvance() {
        return Joi.object<IListAdvance>({
            vdsbsId: Joi.number().required(),
        });
    }

    public listAvailablePs() {
        return Joi.object<IListAvailablePS>({
            vdsbsId: Joi.number().required(),
        });
    }

    public procesPaymentPS() {
        return Joi.object<IProcessPayment>({
            vdsbsId: Joi.number().required(),
            amountToPay: Joi.number().required(),
            paymentType: Joi.valid(...Object.values(PaymentType)).required(),
            totalDeposit: Joi.number().required(),
            totalAdvance: Joi.number().required(),
            psIds: Joi.array().items(Joi.number().required()).required(),
        });
    }

    public listPaymentApprovals() {
        return Joi.object<IListApprovals>({
            vdsbsId: Joi.number().required(),
        });
    }

    public processApprovals() {
        return Joi.object<IApprovals>({
            paymentApprovalId: Joi.number().required(),
            vdsbsId: Joi.number().required(),
            type: Joi.valid("H", "A").required(),
            approved: Joi.valid(true, false).required(),
        });
    }
}

export default new ValidationSchema();
