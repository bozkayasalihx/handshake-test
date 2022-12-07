import { Center, Heading } from "@chakra-ui/react";

interface Props {
    token: string;
}

export const DashBoard: React.FC<Props> = ({ token }) => {
    return (
        <Center>
            <Heading>DashBoard</Heading>
        </Center>
    );
};
