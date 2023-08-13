import { usernameSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import RoundButton from "../round-button/round-button"
import styles from "./auth-modal.module.css"
import Field from "./field"
export default function UsernameForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<{ username: string }>({ resolver: zodResolver(usernameSchema) })

    async function onSubmitHandler(data: { username: string }) {
    }
    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
            <div className={styles.fields}>
                <Field placeholder="Choose a username" {...register("username")} />
            </div>
            <RoundButton theme="red" type="submit">Update</RoundButton>
        </form>
    )
}
