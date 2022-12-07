import { Box, Text } from "@chakra-ui/react";
import React from "react";

interface ErrorMsgProps {
  errorMsg: string;
}

export const ErrorMsg: React.FC<ErrorMsgProps> = ({ errorMsg }) => {
  return (
    <Box color="red" fontSize={"2xl"}>
      <Text>{errorMsg}</Text>
    </Box>
  );
};
