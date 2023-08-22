import { MutationResult } from "@/lib/service/use-mutation"
import { UpdateUsernameBody } from "@/lib/service/use-update-username"
import useValidateUsername from "@/lib/service/use-validate-username"
import { User } from "@/lib/types/users"
import { UpdateUsernameSchema } from "@/lib/validation"
import { UseFormReturn } from "react-hook-form"
import SignButton from "../buttons/sign-button"
import styles from "./auth-modal.module.css"
import Field from "./field"

type UsernameFormProps = {
    form: UseFormReturn<UpdateUsernameSchema>,
    handler: MutationResult<UpdateUsernameBody, User>
}

export default function UsernameForm({ form, handler }: UsernameFormProps) {
    const { register, watch, handleSubmit, formState: { errors } } = form
    const { mutate, isSuccess, isLoading, isError, error: updateError } = handler
    const username = watch("username")
    const isEnable = !errors.username && username.trim().length > 0
    const { error, data, isSuccess: validateSuccess } = useValidateUsername(username, isEnable)

    async function onSubmitHandler(data: UpdateUsernameSchema) {
        await mutate(data)
    }

    const hasError = !!error || !!errors.username
    const helperText = errors.username?.message || error?.message || data?.message
    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)} spellCheck={false} noValidate>
            <div className={styles.fields}>
                <Field
                    required
                    hasError={hasError}
                    hasSuccess={validateSuccess}
                    helperText={helperText}
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
