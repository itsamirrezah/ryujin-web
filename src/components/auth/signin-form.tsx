import RoundButton from "../round-button/round-button"
import Field from "./field"
import AuthWithButton from "./auth-with-button"
import styles from "./auth-modal.module.css"
import { signInSchema, ISignSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useSignIn from "@/lib/service/use-signin"

export default function SignInForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<ISignSchema>({ resolver: zodResolver(signInSchema) })
    const { mutate, isLoading, isSuccess, isError, error } = useSignIn()

    async function onSubmitHandler(data: ISignSchema) {
        await mutate({ ...data, usernameOrEmail: data.username })
    }
    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={styles.fields}>
                <Field placeholder="Username or Email" {...register("username")} />
                <Field placeholder="Password" type="password" {...register("password")} />
            </div>
            <button className={styles.forgot}>Forgot your <span>password</span> ?</button>
            <div className={styles.join}>
                <RoundButton theme="red" type="submit">Login</RoundButton>
                <small> or </small>
                <AuthWithButton>Sign In with Google</AuthWithButton>
            </div>
        </form>
    )
}
