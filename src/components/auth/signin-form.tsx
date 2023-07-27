import RoundButton from "../round-button/round-button"
import Field from "./field"
import AuthWithButton from "./auth-with-button"
import styles from "./auth-modal.module.css"
import { signInSchema, ISignSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useSignIn from "@/lib/service/use-signin"
import { SignOption } from "./auth-modal"
import { useGoogleAuth } from "@/lib/service/use-google-auth"
import { useEffect } from "react"

type SignInFormProps = {
    setSignType: (option: SignOption) => void
    onClose: () => void
}
export default function SignInForm({ setSignType, onClose }: SignInFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<ISignSchema>({ resolver: zodResolver(signInSchema) })
    const { mutate, isLoading, isSuccess, isError, error } = useSignIn()
    const { userInfo, googleAuthHandler, isSuccess: googleSuccess } = useGoogleAuth()

    async function onSubmitHandler(data: ISignSchema) {
        await mutate({ ...data, usernameOrEmail: data.username })
    }

    useEffect(() => {
        if (isSuccess || googleSuccess) onClose()

    }, [isSuccess, googleSuccess])

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={styles.fields}>
                <Field placeholder="Username or Email" {...register("username")} />
                <Field placeholder="Password" type="password" {...register("password")} />
            </div>
            <button className={styles.switch} onClick={() => setSignType("signup")}>No account? <b>Join us</b></button>
            <div className={styles.join}>
                <RoundButton theme="red" type="submit">Login</RoundButton>
                <small> or </small>
                <AuthWithButton type="button" onClick={() => googleAuthHandler()}>Sign In with Google</AuthWithButton>
            </div>
        </form >
    )
}
