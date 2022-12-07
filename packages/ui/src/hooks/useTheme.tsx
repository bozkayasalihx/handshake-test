import { Theme, useTheme } from "@chakra-ui/react";

export const useTypedTheme = () => {
    return useTheme<Theme>();
};
