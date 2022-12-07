import { Box, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useInvoiceFileUploadMutation } from "store";
import { DragAndDrop, ErrorMsg } from "ui";
import { sleep } from "utils";

interface Iinvoice {}

const InvoiceFileUpload: NextPage<Iinvoice> = ({}) => {
    const router = useRouter();
    const [wait, setWait] = useState(true);

    const [fileUpload, { isLoading, isError, isSuccess, data, error }] =
        useInvoiceFileUploadMutation();

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const formData = new FormData();
            const file = acceptedFiles[0];
            formData.set("file", file);
            await fileUpload(formData);
        },
        [fileUpload]
    );

    const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault();
        const file = ev.target.files?.item(0);
        if (!file) return;
        const formData = new FormData();
        formData.set("file", file);
    }, []);

    if (isError) {
        //@ts-ignore
        return <ErrorMsg errorMsg={error?.data?.message} />;
    }

    if (!wait) {
    }

    if (isSuccess) {
        sleep(200).then(() => {
            setWait(false);
            router.push("/fileupload/ps");
        });
    }

    return (
        <Box textAlign="center">
            <Heading mb="2">Fatura Yukle</Heading>
            <DragAndDrop
                name="invoice"
                drop={onDrop}
                change={onChange}
                isLoading={isLoading}
                isError={isError}
            />
        </Box>
    );
};

export default InvoiceFileUpload;
