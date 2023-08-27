import { SignSchema } from "@/lib/validation"
import { UseFormReturn } from "react-hook-form"
import Field from "./field"

type SignInFormProps = {
    form: UseFormReturn<SignSchema>
}

export default function SignInFields({ form }: SignInFormProps) {
    const { register, formState: { errors } } = form

    return (
        <>
            <Field
                required
                hasError={!!errors.username}
                formNoValidate={true}
                helperText={errors.username?.message}
                placeholder="Username or Email"
                {...register("username")}
            />
            <Field
                hasError={!!errors.password}
                helperText={errors.password?.message}
                required
                placeholder="Password"
                type="password"
                {...register("password")}
            />
        </>
    )
}
