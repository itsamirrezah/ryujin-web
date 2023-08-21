import useUpdateUsername from "@/lib/service/use-update-username"
import useValidateUsername from "@/lib/service/use-validate-username"
import { usernameSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import SignButton from "../buttons/sign-button"
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
    const { error, data, isSuccess: validateSuccess } = useValidateUsername(username)
    const { mutate, isSuccess, isError, isLoading, error: updateError } = useUpdateUsername(userId)
    async function onSubmitHandler(data: { username: string }) {
        await mutate(data)
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)} spellCheck={false} noValidate>
            <div className={styles.fields}>
                <Field
                    required
                    hasError={!!error}
                    hasSuccess={validateSuccess}
                    helperText={errors.username?.message || error?.message || data?.message}
                    placeholder="username"
                    {...register("username")}
                />
            </div>
            {isError && <p className={styles.message}>{updateError?.message}</p>}
            <SignButton
                disabled={!username || !validateSuccess}
                type="submit"
                status={isLoading ? "loading" : "normal"}>
                Continue
            </SignButton>
        </form>
    )
}
