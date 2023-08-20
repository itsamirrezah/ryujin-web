import useSignIn from "@/lib/service/use-signin"
import { ISignSchema, signInSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
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
    } = useForm<ISignSchema>({ resolver: zodResolver(signInSchema) })
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
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={styles.fields}>
                <Field hasError={false} helperText="custom error message" required placeholder="Username or Email" {...register("username")} />
                <Field hasError={false} helperText={"another custom message here"} required placeholder="Password" type="password" {...register("password")} />
            </div>
            <button className={styles.switch} onClick={() => setSignType("signup")}>
                Don't have an account? <u>Sign up now</u>
            </button>
            <SignButton
                type="submit"
                status={isLoading ? "loading" : isSuccess ? "succeed" : isError ? "failed" : undefined}>
                Log In
            </SignButton>
        </form>
    )
}
