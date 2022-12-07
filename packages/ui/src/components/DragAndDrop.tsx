import {
    Box,
    Flex,
    Heading,
    Input,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import DownloadIcon from "../assets/Download";
import ShareIcon from "../assets/Share";
import { ErrorMsg } from "../ErrorMessage";

type DropType = (acceptedFiles: File[]) => Promise<void>;
type ChangeType = (ev: React.ChangeEvent<HTMLInputElement>) => void;
interface indexProps {
    name: string;
    drop: DropType;
    change: ChangeType;
    isLoading: boolean;
    isError: boolean;
}

/**
 *
 *
 *      1
 *    2   3
 *
 *  both are not equal because of left one is 2 and right one is 3
 *  so this kinda shows us that not true
 *
 */

export const DragAndDrop: React.FC<indexProps> = ({
    name,
    drop,
    change,
    isLoading,
    isError,
}) => {
    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            onDrop: drop,
        });

    const variant = useBreakpointValue({ base: "100%", sm: "70%", md: "50%" });
    const margin = useBreakpointValue({
        base: "none",
        sm: "0 auto",
        md: "0 auto",
    });

    const handleShare = useCallback(() => {
        console.log("logic not implemented yet");
    }, []);

    return (
        <>
            {!!fileRejections.length && (
                <Box
                    maxW="50%"
                    margin={"0 auto"}
                    bg="red"
                    textAlign={"center"}
                    fontSize="xl"
                >
                    {fileRejections[0].errors[0].message}
                </Box>
            )}
            <Box margin={margin} maxW={variant}>
                <Flex justifyContent={"space-between"} m={5}>
                    <Text>Fatura Dosyasi</Text>
                    <ShareIcon handle={handleShare} />
                </Flex>
                <Flex
                    {...getRootProps()}
                    minH="30vh"
                    border="2px dotted yellow"
                    bg="#ababab"
                    borderRadius={10}
                >
                    <Flex width={"100%"}>
                        <Heading size={"md"} alignSelf={"center"} m="0 auto">
                            {isDragActive ? (
                                "file uploading..."
                            ) : (
                                <DownloadIcon />
                            )}
                            {isLoading && "file uploading..."}
                        </Heading>
                        {isError && (
                            <ErrorMsg errorMsg="an error accured try again later!" />
                        )}
                    </Flex>
                    <Input
                        {...getInputProps()}
                        size={"lg"}
                        type="file"
                        name="file"
                        onChange={change}
                        w="100%"
                    />
                </Flex>
            </Box>
        </>
    );
};
