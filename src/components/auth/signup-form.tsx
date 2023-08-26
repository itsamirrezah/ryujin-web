import { ApiError } from "@/lib/service/types"
import { MutationResult } from "@/lib/service/use-mutation"
import { RegisterBody } from "@/lib/service/use-register-user"
import { User } from "@/lib/types/users"
import { SignUpSchema } from "@/lib/validation"
import { UseFormReturn } from "react-hook-form"
import SignButton from "../buttons/sign-button"
import styles from "./auth-modal.module.css"
import Field from "./field"

type SignUpFormProps = {
    switchSign: () => void,
    form: UseFormReturn<SignUpSchema>,
    handler: MutationResult<RegisterBody, User, ApiError>
}

export default function SignUpForm({ switchSign, form, handler }: SignUpFormProps) {
    const { register, handleSubmit, formState: { errors } } = form
    const { mutate, isSuccess, isError, isLoading, error } = handler

    async function onSubmitHandler(data: SignUpSchema) {
        await mutate(data)
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)} noValidate spellCheck={false}>
            <div className={styles.fields}>
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
            </div>
            {isError && <p className={styles.message}>{error?.message}</p>}
            {!isLoading && <button type="button" className={styles.switch} onClick={() => switchSign()}>
                Already have an account? <u>Sign in</u>
            </button>}
            <SignButton
                disabled={isLoading || isSuccess}
                type="submit"
                status={isLoading ? "loading" : "normal"}>
                Get Started
            </SignButton>
        </form>
    )
}
