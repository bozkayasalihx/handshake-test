import { Box, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes, useRef, useState } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    textArea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
    label,
    textArea = false,
    size: _,
    ...props
}) => {
    let InputOrTextArea = Input;
    props.type;
    //@ts-ignore
    if (textArea) InputOrTextArea = Textarea;
    const [field, { error }] = useField(props);
    const ref = useRef<HTMLInputElement>(null);
    const [show, setShow] = useState(false);
    return (
        <FormControl
            key={label}
            onFocus={() => {
                if (ref.current) {
                    if (ref.current.id === field.name) {
                        setShow(true);
                    }
                }
            }}
        >
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextArea {...field} {...props} id={field.name} ref={ref} />
            {show && <Box color={"red"}>{error && error}</Box>}
        </FormControl>
    );
};
