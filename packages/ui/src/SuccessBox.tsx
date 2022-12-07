import { Box } from "@chakra-ui/react";
import React from "react";

interface ISuccess {
    message?: string;
}

export const SuccessBox: React.FC<ISuccess> = ({ message }) => {
    return (
        <Box w={"50%"} h={"50%"} fontSize={"2xl"}>
            {message ? message : "Sucessfully uploaded"}
        </Box>
    );
};
