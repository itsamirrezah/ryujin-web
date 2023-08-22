import { MutationResult } from "@/lib/service/use-mutation"
import { SigninBody } from "@/lib/service/use-signin"
import { User } from "@/lib/types/users"
import { SignSchema } from "@/lib/validation"
import { UseFormReturn } from "react-hook-form"
import SignButton from "../buttons/sign-button"
import styles from "./auth-modal.module.css"
import Field from "./field"

type SignInFormProps = {
    switchSign: () => void
    form: UseFormReturn<SignSchema>
    handler: MutationResult<SigninBody, User>
}

export default function SignInForm({ switchSign, form, handler }: SignInFormProps) {
    const { register, handleSubmit, formState: { errors } } = form
    const { mutate, isLoading, isSuccess, isError, error } = handler

    async function onSubmitHandler(data: SignSchema) {
        await mutate({ ...data, usernameOrEmail: data.username })
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)} noValidate spellCheck={false}>
            <div className={styles.fields}>
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
            </div>
            {isError && <p className={styles.message}>{error?.message}</p>}
            {!isLoading && <button type="button" className={styles.switch} onClick={() => switchSign()}>
                Don't have an account? <u>Sign up now</u>
            </button>}
            <SignButton
                disabled={isLoading || isSuccess}
                type="submit"
                status={isLoading ? "loading" : "normal"}>
                Login
            </SignButton>
        </form>
    )
}
