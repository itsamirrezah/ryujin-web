import useUpdateUsername from "@/lib/service/use-update-username"
import useValidateUsername from "@/lib/service/use-validate-username"
import { usernameSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import RoundButton from "../round-button/round-button"
import styles from "./auth-modal.module.css"
import Field from "./field"

type UsernameFormProps = {
    userId: string
}

export default function UsernameForm({ userId }: UsernameFormProps) {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm<{ username: string }>({ resolver: zodResolver(usernameSchema), defaultValues: { username: "" } })
    const username = watch("username")
    const { isSuccess, data, error, isError, isLoading } = useValidateUsername(username)
    const { mutate } = useUpdateUsername(userId)
    async function onSubmitHandler(data: { username: string }) {
        await mutate(data)
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
