import en from "locales/en.json";
import tr from "locales/tr.json";
import "react-i18next";

declare module "react-i18next" {
    interface CustomTypeOptions {
        defaultNS: "tr";
        resources: {
            tr: typeof tr;
            en: typeof en;
        };
    }
}

interface ResponseReturnType {
    message: string;
    data: Record<string, any>;
}
interface IValidation {
    email: string;
    password: string;
}
interface IData {
    label: string;
    value: string;
}