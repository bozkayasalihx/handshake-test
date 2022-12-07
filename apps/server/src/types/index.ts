import { Request, Response } from "express";
import * as models from "../models";
// eslint-disable-next-line import/no-cycle
import { dateOptions } from "../validations/validationSchema";

type Interval = string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined;

type NewQS<Q> = qs.ParsedQs & Record<keyof Q, Interval>;

export type TypedResponse<
    T extends { message: string; data?: Record<string, any> } = {
        message: string;
        data?: Record<string, any>;
    }
> = Response<T>;

export type TypedRequest<
    T extends Record<string, any> = {},
    Q extends NewQS<Q> = NewQS<Record<string, never>>
> = Request<any, any, T, Q>;

export interface IBaseParams {
    createdAt: Date;
    updateAt: Date;
}

export interface AttributeFields {
    attribute1?: string;
    attribute2?: string;
    attribute3?: string;
    attribute4?: string;
}

export type OptionalDates = {
    [K in keyof typeof dateOptions]: Date | undefined;
};

export interface GenericError {
    field: string;
    message: string;
}

export enum UserTypes {
    SITE_ADMIN = "SA",
    VENDOR = "V",
    VENDOR_ADMIN = "VA",
    BUYER = "B",
    BUYER_ADMIN = "BA",
    DEALER = "D",
    DEALER_ADMIN = "DA",
}

export const allModels = {
    ...models,
};

export enum FileStatusType {
    NEW = "N",
    VALIDATED = "V",
    REJECTED = "R",
    INTERFACED = "I",
    INVOICED = "S",
}

export enum FileRecordType {
    HEADER = "H",
    LINE = "L",
}

export enum LineStatusType {
    NEW = "N",
    ERROR = "E",
    SUCCESS = "S",
}
export enum InvoiceStatusType {
    NEW = "A",
    PENDING_APPROVAL = "B",
    APPROVED = "C",
    REJECTED = "D",
    CANCELLED = "E",
}

export enum InvoicedStatusType {
    NO_INVOICE = "N",
    PARTIALLY_PAID = "P",
    FULLY_PAID = "C",
}

export enum PaymentStatusType {
    NO_PAYMENT = "N",
    PARTIALLY_PAID = "P",
    FULLY_PAID = "C",
}
export enum PaymentType {
    DEPOSIT = "D",
    ADVANCE = "A",
    VINOV = "V",
    CREDIT_CARD = "CC",
    CASH = "C",
    KMH = "K",
}
export enum Currency {
    USD = "USD",
    EUR = "EUR",
    TRY = "TRY",
}
export enum DepositStatusType {
    ENTERED = "E",
    PENDING_APPROVAL = "P",
    APPROVED = "A",
    REJECTED = "R",
    USED = "DU",
    PARTIALLY_USED = "DPU",
}

export enum AdvanceType {
    VINOV = "V",
    CREDIT_CARD = "CC",
    CASH = "C",
    KMH = "K",
}

export enum AdvanceStatusType {
    ENTERED = "E",
    PENDING_APPROVAL = "P",
    APPROVED = "A",
    REJECTED = "R",
    USED = "AU",
    PARTIALLY_USED = "APU",
}

export enum HasPs {
    YES = "Y",
    NO = "N",
}

export enum PaymentApprovalStatus {
    PENDING = "P",
    APPROVAL = "A",
    REJECTED = "R",
}
