import { Button as ChakraButton } from "@chakra-ui/react";
import { FC } from "react";

interface IButton {
    title: string;
    color?: string;
    bg?: string;
    callback?: () => void;
}

export const Button: FC<IButton> = ({
    title,
    color = "#000000",
    callback,
    bg = "#FEC524",
}) => (
    <ChakraButton
        // display={{ base: "", md: "inline-flex" }}
        mb="5"
        fontSize={"sm"}
        flex={1}
        width={200}
        paddingX={8}
        fontWeight={600}
        color={color}
        bg={bg}
        onClick={callback}
        _hover={{
            bg: `${bg}.300`,
        }}
    >
        {title}
    </ChakraButton>
);
