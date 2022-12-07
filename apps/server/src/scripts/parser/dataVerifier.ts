/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import dayjs from "dayjs";
import { Decimal } from "decimal.js";
import Joi from "joi";
import { InvoiceInterface, PaymentScheduleInterface } from "../../models";
import GroupBy, { ArrayRecord, MapType } from "../../scripts/groupBy";
import { Currency, HasPs } from "../../types";

type Tabletype = "psi" | "vi";
export type PickedPSI = Pick<
    PaymentScheduleInterface,
    | "invoice_no"
    | "line_no"
    | "due_date"
    | "currency"
    | "external_bs_code"
    | "external_ds_code"
    | "external_v_code"
    | "amount"
>;

export type PickedVI = Pick<
    InvoiceInterface,
    | "record_type"
    | "invoice_no"
    | "external_bs_code"
    | "external_ds_code"
    | "external_v_code"
    | "invoice_date"
    | "has_ps"
    | "due_date"
    | "amount"
    | "currency"
    | "line_no"
    | "item_quantity"
    | "item_uom"
    | "item_description"
    | "related_users"
>;

type PickedVILine = Pick<
    PickedVI,
    | "amount"
    | "item_quantity"
    | "item_description"
    | "invoice_no"
    | "record_type"
>;

export type PSIVerifierType = Array<Args<PickedPSI>>;
export type InvoiceVerifierType = Array<Args<PickedVI>>;
class DataVerifier<T extends ArrayRecord> extends GroupBy<T> {
    private type: Tabletype;

    private dataVerifierData: {
        psi: PSIVerifierType;
        vi: InvoiceVerifierType;
    };

    private errorObj: Map<string, any> = new Map();
    private dateFormat = "DD/MM/YYYY";

    private H = "H";
    private L = "L";

    constructor(type: Tabletype, private dateFormater = dayjs) {
        super();
        this.type = type;
        this.dataVerifierData = {
            psi: [],
            vi: [],
        };
    }

    public get errors() {
        return this.errorObj;
    }

    public setPSIData(data: PSIVerifierType) {
        this.dataVerifierData.psi = data;
    }

    public setVIData(data: InvoiceVerifierType) {
        this.dataVerifierData.vi = data;
    }

    public get getVIData() {
        return this.dataVerifierData.vi;
    }

    public get getPSIData() {
        return this.dataVerifierData.psi;
    }

    private erorrKeyGen(err: string) {
        const res = /"([^"]*)"/gi.exec(err);
        if (res) return res[1];
        return null;
    }

    private strToFloat(str: string) {
        const parsed = parseFloat(str.replace(",", "."));
        if (Number.isNaN(parsed)) {
            return str;
        }
        return parsed;
    }

    private strToInt(str: string) {
        return parseInt(str, 10);
    }

    private invoiceInterfaceHeaderValidationSchema() {
        return Joi.object<PickedVI>({
            currency: Joi.object({
                currency: Joi.valid(...Object.values(Currency)).optional(),
            }),
            invoice_no: Joi.object({
                invoice_no: Joi.string().required().max(30).required(),
            }),
            invoice_date: Joi.object({
                invoice_date: Joi.date().optional(),
            }),
            amount: Joi.object({ amount: Joi.number().required() }),
            due_date: Joi.object({ due_date: Joi.date().required() }),
            external_bs_code: Joi.object({
                external_bs_code: Joi.string().required(),
            }),
            external_ds_code: Joi.object({
                external_ds_code: Joi.string().required(),
            }),
            external_v_code: Joi.object({
                external_v_code: Joi.string().required(),
            }),
            has_ps: Joi.object({
                has_ps: Joi.valid(...Object.values(HasPs)).required(),
            }),
            record_type: Joi.object({
                record_type: Joi.valid("H", "L").required(),
            }),
        });
    }

    private invoiceInterfaceLineValidationSchema() {
        return Joi.object<PickedVILine>({
            invoice_no: Joi.object({
                invoice_no: Joi.string().required().max(30).required(),
            }),
            amount: Joi.object({ amount: Joi.number().required() }),
            item_quantity: Joi.object({
                item_quantity: Joi.number().required(),
            }),
            item_description: Joi.object({
                item_description: Joi.string().required(),
            }),
            record_type: Joi.object({
                record_type: Joi.valid("H", "L").required(),
            }),
        });
    }

    private PSIHeaderValidationSchema() {
        return Joi.object<PickedPSI>({
            currency: Joi.object({
                currency: Joi.valid(...Object.values(Currency)).required(),
            }),

            line_no: Joi.object({
                line_no: Joi.number().required(),
            }),
            due_date: Joi.object({
                due_date: Joi.date().required(),
            }),
            amount: Joi.object({
                amount: Joi.number().required(),
            }),

            invoice_no: Joi.object({
                invoice_no: Joi.string().required(),
            }),

            external_v_code: Joi.object({
                external_v_code: Joi.string().required(),
            }),

            external_bs_code: Joi.object({
                external_bs_code: Joi.string().required(),
            }),

            external_ds_code: Joi.object({
                external_ds_code: Joi.string().required(),
            }),
        });
    }

    private viTransformer(data: Args<PickedVI>) {
        // @ts-ignore
        data.amount = this.errorCatcher<string, number>((data) => {
            return this.strToFloat(data as string);
        }, data.amount);

        data.due_date = this.errorCatcher((data) => {
            return (data = data
                ? this.dateFormater(data).format(this.dateFormat)
                : void 0);
        }, data.due_date);

        data.invoice_date = this.errorCatcher((data) => {
            return (data = data
                ? this.dateFormater(data).format(this.dateFormat)
                : void 0);
        }, data.invoice_date);

        return data;
    }

    private errorCatcher<V, ReturnType>(cb: (data: V) => ReturnType, data: V) {
        try {
            return cb(data);
        } catch (err) {
            return data;
        }
    }

    private transform() {
        const newData: { psi: PSIVerifierType; vi: InvoiceVerifierType } = {
            psi: [],
            vi: [],
        };

        if (this.type === "vi") {
            for (let i = 0; i < this.dataVerifierData.vi.length; i++) {
                try {
                    const newCur = this.viTransformer(
                        this.dataVerifierData.vi[i]
                    );
                    newData.vi.push(newCur as InvoiceInterface);
                } catch (er) {
                    continue;
                }
            }
        } else if (this.type === "psi") {
            for (let i = 0; i < this.dataVerifierData.psi.length; i++) {
                //@ts-ignore
                this.dataVerifierData.psi[i].amount = this.errorCatcher(
                    (data) => {
                        return this.strToFloat(data);
                    },
                    this.dataVerifierData.psi[i].amount
                );

                this.dataVerifierData.psi[i].due_date = this.errorCatcher(
                    (data) => {
                        return data
                            ? this.dateFormater(data).format(this.dateFormat)
                            : void 0;
                    },
                    this.dataVerifierData.psi[i].due_date
                );

                //@ts-ignore
                this.dataVerifierData.psi[i].line_no = this.errorCatcher(
                    (data) => {
                        return this.strToInt(data);
                    },
                    this.dataVerifierData.psi[i].line_no
                );

                newData.psi.push(this.dataVerifierData.psi[i]);
            }
        }

        this.dataVerifierData = newData;
        return newData;
    }

    public validateViAmount() {
        const data = this.group().map;
        let total = new Decimal(0.0);
        let map = new Map<boolean, number>();
        for (let [key] of data) {
            const [i, vals] = data.get(key) as MapType<T>;
            for (let i = 0; i < vals.length; i++) {
                if (vals[i].record_type === this.H) {
                    total = total.plus(new Decimal(vals[i].amount));
                } else {
                    total = total.minus(new Decimal(vals[i].amount));
                }
            }
            map.set(total.equals(0), i);
            total = new Decimal(0);
        }
        return map;
    }

    public validatePSIAmount(data: Map<string, MapType<PSIVerifierType>>) {
        const totalMap: Map<string, [number, string]> = new Map();
        for (let [key, values] of data) {
            let keyTotal = new Decimal(0.0);
            const [index, vals] = values;
            for (let i = 0; i < vals.length; i++) {
                keyTotal = keyTotal.plus(new Decimal(vals[i].amount));
            }
            totalMap.set(key, [index, keyTotal.toString()]);
            keyTotal = new Decimal(0.0);
        }
        return totalMap;
    }

    private recordFilter(
        data: Array<Partial<InvoiceInterface>>,
        whichType: "H" | "L" = "H"
    ) {
        const list: Array<Partial<InvoiceInterface>> = [];
        for (let i = 0; i < data.length; i++) {
            const cur = data[i];
            if (cur.record_type === whichType) list.push(cur);
        }
        return list;
    }

    public genKeys(line: number, key: string) {
        return `${line}__${key}`;
    }

    public validate() {
        this.transform();
        for (let i = 0; i < this.dataVerifierData[this.type].length; i++) {
            const keys = Object.keys(this.dataVerifierData[this.type][i]);
            let schema:
                | (() => Joi.ObjectSchema<PickedPSI>)
                | (() => Joi.ObjectSchema<PickedVI>)
                | (() => Joi.ObjectSchema<PickedVILine>) =
                this.type === "psi"
                    ? this.PSIHeaderValidationSchema
                    : this.invoiceInterfaceHeaderValidationSchema;

            if (schema === this.invoiceInterfaceHeaderValidationSchema) {
                if (this.dataVerifierData.vi[i].record_type === this.L) {
                    schema = this.invoiceInterfaceLineValidationSchema;
                }
            }

            for (let j = 0; j < keys.length; j++) {
                try {
                    const { error } = schema()
                        .extract(keys[j])
                        .validate({
                            [keys[j]]:
                                this.dataVerifierData[this.type][i][keys[j]],
                        });

                    if (error) {
                        this.errorObj.set(
                            `${i}__${keys[j]}`,
                            error.message.replace(
                                this.erorrKeyGen(error?.message)!,
                                Object.keys(error._original)[0]
                            )
                        );
                    }
                } catch (err) {
                    continue;
                }
            }
        }
    }
}

export default DataVerifier;
