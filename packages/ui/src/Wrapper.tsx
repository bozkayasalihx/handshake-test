import { Flex } from "@chakra-ui/react";
import React, { CSSProperties } from "react";

interface WrapperProps {
    variant?: "regular" | "small" | "large";
    mt?: "sm" | "md" | "lg";
    style?: CSSProperties;
    children: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({
    children,
    variant = "regular",
    mt,
    style,
}) => {
    return (
        <Flex
            flex={1}
            m="auto"
            align="center"
            mt={
                mt === "sm"
                    ? "5px"
                    : mt === "md"
                    ? "10px"
                    : mt === "lg"
                    ? "15px"
                    : undefined
            }
            style={style}
            maxW={
                variant === "regular" ? 800 : variant === "large" ? 1200 : 400
            }
        >
            {children}
        </Flex>
    );
};
