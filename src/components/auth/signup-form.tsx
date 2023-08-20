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

//FIXME: ui for validate error
export default function SignUpForm({ setSignType, onClose }: SignUpFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ISignUpSchema>({ resolver: zodResolver(signUpSchema) })
    const {
        mutate,
        isSuccess,
        isError,
        isLoading
    } = useRegisterUser()

    async function onSubmitHandler(data: ISignUpSchema) {
        await mutate(data)
    }

    useEffect(() => {
        if (isSuccess) onClose()
    }, [isSuccess])

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={styles.fields}>
                <Field required placeholder="Username" {...register("username")} />
                <Field required placeholder="Email" type="email" {...register("email")} />
                <Field required placeholder="Password" type="password" {...register("password")} />
                <Field required placeholder="Confirm Password" type="password" {...register("password")} />
            </div>
            <button className={styles.switch} onClick={() => setSignType("signin")}>
                Already have an account? <u>Sign in</u></button>
            <SignButton
                type="submit"
                status={isLoading ? "loading" : isSuccess ? "succeed" : isError ? "failed" : undefined}>
                Get Started
            </SignButton>
        </form>
    )
}
