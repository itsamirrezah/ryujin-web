import { SignUpSchema } from "@/lib/validation"
import { UseFormReturn } from "react-hook-form"
import Field from "./field"

type SignUpFormProps = {
    form: UseFormReturn<SignUpSchema>,
}

export default function SignUpFields({ form }: SignUpFormProps) {
    const { register, formState: { errors } } = form
    return (
        <>
            <Field
                required
                hasError={!!errors.username}
                helperText={errors.username?.message}
                placeholder="Username"
                {...register("username")}
            />
            <Field
                required
                hasError={!!errors.email}
                helperText={errors.email?.message}
                placeholder="Email"
                {...register("email")}
            />
            <Field
                required
                hasError={!!errors.password}
                helperText={errors.password?.message}
                placeholder="Password"
                type="password"
                {...register("password")}
            />
            <Field
                required
                hasError={!!errors.confirm}
                helperText={errors.confirm?.message}
                placeholder="Confirm Password"
                type="password"
                {...register("confirm")}
            />
        </>
    )
}
