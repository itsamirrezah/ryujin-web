import useSignIn from "@/lib/service/use-signin"
import { ISignSchema, signInSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import SignButton from "../buttons/sign-button"
import { SignOption } from "./auth-modal"
import styles from "./auth-modal.module.css"
import Field from "./field"

type SignInFormProps = {
    setSignType: (option: SignOption) => void
    onClose: () => void
}
export default function SignInForm({ setSignType, onClose }: SignInFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ISignSchema>({ mode: "onBlur", resolver: zodResolver(signInSchema) })
    console.log({ errors })
    const {
        mutate,
        isLoading,
        isSuccess,
        isError,
        error
    } = useSignIn()

    async function onSubmitHandler(data: ISignSchema) {
        await mutate({ ...data, usernameOrEmail: data.username })
    }

    useEffect(() => {
        if (isSuccess) onClose()
    }, [isSuccess])

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)} noValidate>
            <div className={styles.fields}>
                <Field
                    required
                    hasError={!!errors.username}
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
            {!isLoading && <button className={styles.switch} onClick={() => setSignType("signup")}>
                Don't have an account? <u>Sign up now</u>
            </button>}
            {isError && <p className={styles.message}>{error?.message}</p>}
            <SignButton
                disabled={isLoading || isSuccess}
                type="submit"
                status={isLoading ? "loading" : "normal"}>
                Login
            </SignButton>
        </form>
    )
}
