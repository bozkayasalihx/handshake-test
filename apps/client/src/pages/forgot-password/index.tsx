import { Validator } from "scripts";
import { Field, UIForm } from "ui";

const ForgotPassword = () => {
    return (
        <UIForm
            fields={fields}
            initialValue={{ email: "" }}
            onSubmit={async ({ email }) => {}}
            headingText="Forgot Password"
            submitText="Reset"
            validate={({ email }) => {
                const valids = new Validator({ email });
                valids.validateEmail();
                return valids.errors;
            }}
        />
    );
};

const fields: Array<Field> = [
    {
        label: "Email",
        name: "email",
        type: "email",
    },
];

export default ForgotPassword;
