import useRegisterUser from "@/lib/service/use-register-user"
import { ISignUpSchema, signUpSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import RoundButton from "../round-button/round-button"
import { SignOption } from "./auth-modal"
import styles from "./auth-modal.module.css"
import Field from "./field"

type SignUpFormProps = {
    setSignType: (option: SignOption) => void
    onClose: () => void
}

//FIXME: ui for validate error
export default function SignUpForm({ setSignType, onClose }: SignUpFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<ISignUpSchema>({ resolver: zodResolver(signUpSchema) })
    const { mutate, isSuccess } = useRegisterUser()

    async function onSubmitHandler(data: ISignUpSchema) {
        await mutate(data)
    }

    useEffect(() => {
        if (isSuccess) onClose()
    }, [isSuccess])

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={styles.fields}>
                <Field placeholder="Username" {...register("username")} />
                <Field placeholder="Email" type="email" {...register("email")} />
                <Field placeholder="Password" type="password" {...register("password")} />
            </div>
            <button className={styles.switch} onClick={() => setSignType("signin")}>Already have an account? <b>Sign in</b></button>
            <p className={styles.terms}>By continuing, you agree to Ryujin’s <a href="#">Terms of Service</a><br />and acknowledge you've read our <a href="#">Privacy Policy</a></p>
            <RoundButton theme="red" type="submit">Join us</RoundButton>
        </form>
    )
}
