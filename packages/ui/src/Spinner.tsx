import { Spinner } from "@chakra-ui/react";
import { selectSpinner, useAppSelector } from "store";

export const GSpinner = () => {
    const isLoading = useAppSelector(selectSpinner);
    return (
        <>
            {isLoading && (
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="lg"
                    position={"absolute"}
                    top={2}
                    right={4}
                />
            )}
        </>
    );
};
