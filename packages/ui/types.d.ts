import tr from "locales/tr.json";
import en from "locales/en.json";

declare module "react-i18next" {
    // and extend them!
    interface CustomTypeOptions {
        // custom namespace type if you changed it
        defaultNS: "tr";
        // custom resources type
        resources: {
            en: typeof en;
            tr: typeof tr;
        };
    }
}
