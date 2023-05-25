import Field from "./field"
import RoundButton from "../round-button/round-button"
import AuthWithButton from "./auth-with-button"
import styles from "./auth-modal.module.css"
import { signUpSchema, ISignUpSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useRegisterUser from "@/lib/service/use-register-user"

//FIXME: ui for validate error
export default function SignUpForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<ISignUpSchema>({ resolver: zodResolver(signUpSchema) })
    const { mutate } = useRegisterUser()

    async function onSubmitHandler(data: ISignUpSchema) {
        await mutate(data)
    }
    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={styles.fields}>
                <Field placeholder="Username" {...register("username")} />
                <Field placeholder="Email" type="email" {...register("email")} />
                <Field placeholder="Password" type="password" {...register("password")} />
            </div>
            <p className={styles.terms}>By continuing, you agree to Ryujin’s <a href="#">Terms of Service</a><br />and acknowledge you've read our <a href="#">Privacy Policy</a></p>
            <div className={styles.join}>
                <RoundButton theme="red" type="submit">Join us</RoundButton>
                <small> or </small>
                <AuthWithButton>Sign Up with Google</AuthWithButton>
            </div>
        </form>
    )
}
