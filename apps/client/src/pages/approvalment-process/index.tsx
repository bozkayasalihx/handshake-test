import { Box, Heading } from "@chakra-ui/react";
import { Button } from "ui";

const ApprovalmentProcess = () => {
    return (
        <Box textAlign={"center"}>
            <Heading my="4">Onay Islemleri</Heading>
            <Box>
                <Box>
                    <Button title="Fature Kabul" bg="#ABABAB" color="#000000" />
                </Box>
                <Box>
                    <Button title="Ode Onayi" bg="#ABABAB" color="#000000" />
                </Box>
                <Box>
                    <Button
                        title="Deposit Islem Onayi"
                        bg="#ABABAB"
                        color="#000000"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ApprovalmentProcess;
