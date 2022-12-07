import { __prod__ } from "config";
import { i18n } from "locales";
import type { en } from "locales";
// /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
export class Validator<T extends Record<any, any>> {
    private values: T;
    private errs: Partial<Record<string, string>> = {};
    constructor(values: T) {
        this.values = values;
    }

    private get userRegex() {
        return /^[A-z][A-z0-9-_]{3,23}$/;
    }
    private get passwordRegex() {
        return __prod__ ? /^(?=\w{5})(?=.*\d{2,})/ : /.{2,}/;
    }
    private get emailRegex() {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    }

    public validateUser() {
        if (!this.userRegex.test(this.values.user)) {
            this.errs.user = i18n.t("invalidUsername");
        }
    }
    public validateEmail() {
        if (!this.emailRegex.test(this.values.email)) {
            this.errs.email = i18n.t("invalidEmail");
        }
    }
    public validatePassword() {
        if (!this.passwordRegex.test(this.values.password)) {
            this.errs.password = i18n.t("invalidPassword");
        }
    }
    public get errors() {
        return this.errs;
    }
}
