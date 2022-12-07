import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useAppSelector, usePSIFileUplaodMutation, viIdSelect } from "store";
import { DragAndDrop, ErrorMsg } from "ui";
import { sleep } from "utils";

interface IPs {}

const PsFileUpload: NextPage<IPs> = () => {
    const router = useRouter();

    const [fileUpload, { isLoading, isError, isSuccess, data, error }] =
        usePSIFileUplaodMutation();
    const psId = useAppSelector(viIdSelect);

    const [wait, setWait] = useState(true);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const formData = new FormData();
            const file = acceptedFiles[0];
            formData.set("file", file);
            await fileUpload({ id: psId, formData });
        },
        [fileUpload, psId]
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

    if (isSuccess) {
        sleep(200).then(() => {
            router.push("/");
        });
    }

    return (
        <Box>
            <DragAndDrop
                name="Payment Schedule"
                change={onChange}
                drop={onDrop}
                isError={isError}
                isLoading={isLoading}
            />
        </Box>
    );
};
export default PsFileUpload;
