import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Validator } from "scripts";
import { useLoginMutation } from "store";
import { Field, UIForm } from "ui";

interface LoginProps {}

const Login: NextPage<LoginProps> = ({}) => {
    const [login, { isLoading, error }] = useLoginMutation({});
    const router = useRouter();

    if (isLoading) {
        return <Box>loading...</Box>;
    }

    return (
        <UIForm
            fields={fields}
            initialValue={{
                email: "",
                password: "",
            }}
            //@ts-ignore
            onSubmit={login}
            remenberMe={true}
            forgottenPass={true}
            validate={({ email, password }) => {
                const valids = new Validator({ email, password });
                valids.validateEmail();
                valids.validatePassword();
                return valids.errors;
            }}
            submitText="Submit"
            errorMsg={error && "invalid account"}
            ForgottenPass={true}
            handleForgotPass={() => {
                router.push("/forgot-password");
            }}
        />
    );
};

const fields: Array<Field> = [
    {
        label: "email",
        name: "email",
        type: "email",
    },

    {
        label: "Password",
        name: "password",
        type: "password",
    },
];

export default Login;
