import { Box, Heading } from "@chakra-ui/react";
import { Button } from "ui";

const MainMenu = () => {
    return (
        <Box textAlign={"center"}>
            <Heading my="4">Ana Menu</Heading>
            <Box>
                <Box>
                    <Button
                        title="Onay Islemleri"
                        bg="#ABABAB"
                        color="#000000"
                    />
                </Box>
                <Box>
                    <Button title="Fatura Ode" bg="#ABABAB" color="#000000" />
                </Box>
                <Box>
                    <Button
                        title="Avans Islemleri"
                        bg="#ABABAB"
                        color="#000000"
                    />
                </Box>
                <Box>
                    <Button
                        title="Deposito Islemleri"
                        bg="#ABABAB"
                        color="#000000"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default MainMenu;
