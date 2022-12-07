import { Box } from "@chakra-ui/react";
import Header from "@src/components/Header";
import Login from "@src/pages/login";
import React, { FC } from "react";
import { tokenSelect, useAppSelector } from "store";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    const token = useAppSelector(tokenSelect);

    if (!token) {
        return (
            <>
                <Header />
                <Login />
            </>
        );
    }

    return (
        <Box maxW={"80%"} m={"0 auto"}>
            <Header />
            {children}
        </Box>
    );
};

export default Layout;
