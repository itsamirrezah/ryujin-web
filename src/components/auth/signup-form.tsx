import useRegisterUser from "@/lib/service/use-register-user"
import { ISignUpSchema, signUpSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import SignButton from "../buttons/sign-button"
import { SignOption } from "./auth-modal"
import styles from "./auth-modal.module.css"
import Field from "./field"

type SignUpFormProps = {
    setSignType: (option: SignOption) => void
    onClose: () => void
}

export default function SignUpForm({ setSignType, onClose }: SignUpFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ISignUpSchema>({ mode: "onBlur", resolver: zodResolver(signUpSchema) })
    const {
        mutate,
        isSuccess,
        isError,
        isLoading,
        error
    } = useRegisterUser()

    async function onSubmitHandler(data: ISignUpSchema) {
        await mutate(data)
    }

    useEffect(() => {
        if (isSuccess) onClose()
    }, [isSuccess])

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
            {!isLoading && <button className={styles.switch} onClick={() => setSignType("signin")}>
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
