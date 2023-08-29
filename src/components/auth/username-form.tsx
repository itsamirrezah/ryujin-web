import useUpdateUsername from "@/lib/service/use-update-username"
import useValidateUsername from "@/lib/service/use-validate-username"
import { UpdateUsernameSchema } from "@/lib/validation"
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import SignButton from "../buttons/sign-button"
import styles from "./auth-modal.module.css"
import Field from "./field"

type UsernameFormProps = {
    form: UseFormReturn<UpdateUsernameSchema>,
    userId: string
    setClosable: (value: boolean) => void
}

export default function UsernameForm({ form, userId, setClosable }: UsernameFormProps) {
    const { register, watch, handleSubmit, formState: { errors, isValidating } } = form
    const { mutate, isSuccess, isLoading, isError, error: updateError } = useUpdateUsername(userId)
    const username = watch("username")
    const isEnable = !isValidating && !errors.username && username.trim().length > 0
    const { error, data, isSuccess: validateSuccess } = useValidateUsername(username, isEnable)

    async function onSubmitHandler(data: UpdateUsernameSchema) {
        await mutate(data)
    }

    useEffect(() => {
        if (!isLoading) setClosable(true)
        else setClosable(false)
    }, [isLoading])

    const hasError = !!error || !!errors.username
    const helperText = hasError ? (errors.username?.message || error?.message) : data?.username ? `${data.username} is available` : ""
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
