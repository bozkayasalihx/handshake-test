import React from "react";
import { Text as CText } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import en from "locales/en.json";
import tr from "locales/tr.json";

interface CustomTypeOptions {
    defaultNS: "tr";
    resources: {
        tr: typeof tr;
        en: typeof en;
    };
}

const Text = () => {
    const { t } = useTranslation<CustomTypeOptions>();
    return <CText>{t("")}</CText>;
};

export default Text;
