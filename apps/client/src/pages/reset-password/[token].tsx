import { NextPage } from "next";
import { useState } from "react";
import { Validator } from "scripts";
import { Field, UIForm } from "ui";

interface Props {
    token: string;
}
const ResetPassword: NextPage<Props> = ({ token }) => {
    const [err, setError] = useState("");
    // const handleSubmit = useCallback(
    //     async ({ password }) => {
    //         try {
    //             const resp = await request.post("/reset-password", {
    //                 token,
    //                 newPassword: password,
    //             });
    //             console.log("response", resp);
    //         } catch (err: any) {
    //             setError(err?.response?.data?.message);
    //         }
    //     },
    //     [token]
    // );
    return (
        <UIForm
            fields={fields}
            initialValue={{ password: "" }}
            onSubmit={async ({ password }) => {
                // try {
                //     const resp = await request.post("/reset-password", {
                //         token,
                //         newPassword: password,
                //     });
                //     console.log("response", resp);
                // } catch (err: any) {
                //     setError(err?.response?.data?.message);
                // }
            }}
            headingText="Reset Password"
            submitText="Reset"
            validate={({ password }) => {
                const valids = new Validator({ password });
                valids.validatePassword();
                return valids.errors;
            }}
            errorMsg={err}
        />
    );
};

ResetPassword.getInitialProps = async (ctx) => {
    return { token: ctx.query.token as string };
};

const fields: Array<Field> = [
    {
        label: "New Password",
        name: "password",
        type: "password",
    },
];

export default ResetPassword;
