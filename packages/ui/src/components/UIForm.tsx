import {
    Box,
    Button,
    Checkbox,
    Flex,
    Heading,
    HStack,
    Link,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import { FC, InputHTMLAttributes } from "react";
import { InputField } from "../InputField";

type InitialValue = Record<string, any>;

export interface Field {
    name: string;
    label: string;
    type: InputHTMLAttributes<HTMLInputElement>["type"];
}

interface Props {
    initialValue: Record<string, any>;
    headingText?: string;
    remenberMe?: boolean;
    ForgottenPass?: boolean;
    handleForgotPass?: () => void;
    submitText?: string;
    errorMsg?: string;
    onSubmit: (
        values: InitialValue,
        formikHelpers: FormikHelpers<InitialValue>
    ) => void | Promise<any>;
    fields: Array<Field>;
    validate?: (
        values: InitialValue
    ) => void | object | Promise<FormikErrors<InitialValue>>;
}

export const UIForm: FC<Props> = ({
    initialValue,
    onSubmit,
    headingText = "Giris Yap",
    remenberMe = false,
    submitText = "Submit",
    fields,
    validate,
    errorMsg,
    ForgottenPass = false,
    handleForgotPass,
}) => {
    const bg1 = useColorModeValue("gray.50", "gray.800");
    const bg2 = useColorModeValue("white", "gray.700");
    const minW = useBreakpointValue({ base: "100%", md: "60%", lg: "40%" });
    return (
        <Formik
            initialValues={initialValue}
            onSubmit={onSubmit}
            validate={validate}
        >
            {(props) => {
                return (
                    <Flex
                        minH={"100%"}
                        align={"center"}
                        justify={"center"}
                        bg={bg1}
                    >
                        <Stack
                            spacing={8}
                            mx={"auto"}
                            maxW={"lg"}
                            py={12}
                            px={6}
                            minW={minW}
                        >
                            <Stack align={"center"}>
                                <Heading fontSize={"4xl"}>
                                    {headingText}
                                </Heading>
                            </Stack>
                            <Box 
                                rounded={"lg"} 
                                bg={bg2} 
                                boxShadow={"lg"} 
                                p={8}
                            >
                                <form onSubmit={props.handleSubmit}>
                                    <VStack spacing={4} align="flex-start">
                                        <Text color="red">{errorMsg}</Text>
                                        {fields.map(({ label, name, type }) => (
                                            <InputField
                                                label={label}
                                                name={name}
                                                key={label}
                                                type={type}
                                            />
                                        ))}

                                        <HStack
                                            justifyContent={"space-between"}
                                            width={"100%"}
                                        >
                                            {remenberMe && (
                                                <Checkbox
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    onChange={
                                                        props.handleChange
                                                    }
                                                    isChecked={
                                                        props.values.rememberMe
                                                    }
                                                    colorScheme="purple"
                                                >
                                                    Remember me?
                                                </Checkbox>
                                            )}
                                            {ForgottenPass && (
                                                <Link
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        handleForgotPass &&
                                                            handleForgotPass();
                                                    }}
                                                >
                                                    Forgot Password
                                                </Link>
                                            )}
                                        </HStack>
                                        <Button
                                            type="submit"
                                            colorScheme="black"
                                            width="full"
                                            bg={"#FEC524"}
                                            isLoading={props.isSubmitting}
                                        >
                                            {submitText}
                                        </Button>
                                    </VStack>
                                </form>
                            </Box>
                        </Stack>
                    </Flex>
                );
            }}
        </Formik>
    );
};
