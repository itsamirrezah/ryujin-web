import RoundButton from "../round-button/round-button"
import Field from "./field"
import styles from "./auth-modal.module.css"
import { signInSchema, ISignSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useSignIn from "@/lib/service/use-signin"
import { SignOption } from "./auth-modal"
import { useEffect } from "react"

type SignInFormProps = {
    setSignType: (option: SignOption) => void
    onClose: () => void
}
export default function SignInForm({ setSignType, onClose }: SignInFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<ISignSchema>({ resolver: zodResolver(signInSchema) })
    const { mutate, isLoading, isSuccess, isError, error } = useSignIn()

    async function onSubmitHandler(data: ISignSchema) {
        await mutate({ ...data, usernameOrEmail: data.username })
    }

    useEffect(() => {
        if (isSuccess) onClose()

    }, [isSuccess])

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={styles.fields}>
                <Field placeholder="Username or Email" {...register("username")} />
                <Field placeholder="Password" type="password" {...register("password")} />
            </div>
            <button className={styles.switch} onClick={() => setSignType("signup")}>No account? <b>Join us</b></button>
            <RoundButton theme="red" type="submit">Login</RoundButton>
        </form >
    )
}
