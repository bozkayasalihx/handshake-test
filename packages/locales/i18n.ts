import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tr from "./tr.json";

const resources = {
    en: {
        translation: en,
    },

    tr: {
        translation: tr,
    },
};
i18n.use(initReactI18next)
    .use(languageDetector)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        react: {
            bindI18n: "languageChanged",
            useSuspense: true,
        },
    });

export default i18n;
