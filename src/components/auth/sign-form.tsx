import { useGoogleAuth } from "@/lib/service/use-google-auth"
import useRegisterUser from "@/lib/service/use-register-user"
import useSignIn from "@/lib/service/use-signin"
import { SignSchema, SignUpSchema } from "@/lib/validation"
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import InteractiveButton from "../buttons/interactive-button"
import { SignOption } from "./auth-modal"
import styles from "./auth-modal.module.css"
import AuthWithButton from "./auth-with-button"
import SignInFields from "./signin-fields"
import SignUpFields from "./signup-fields"


type SignInOrUp = Extract<SignOption, "signin" | "signup">

type SignFormProps = {
    signUpForm: UseFormReturn<SignUpSchema>
    signInForm: UseFormReturn<SignSchema>
    signType: SignInOrUp
    switchHandler: () => void
    setClosable: (value: boolean) => void
}

export default function SignForm({ signInForm, signUpForm, signType, switchHandler, setClosable }: SignFormProps) {
    const [errorMessage, setErrorMessage] = useState<Record<SignInOrUp, string>>({} as Record<SignInOrUp, string>)
    const signInMutation = useSignIn()
    const signUpMutation = useRegisterUser()
    const googleSignMutation = useGoogleAuth()
    const mutation = signType === "signup" ? signUpMutation : signInMutation

    async function onSignUpHandler(data: SignUpSchema) {
        await signUpMutation.mutate(data)
    }

    async function onSignInHandler(data: SignSchema) {
        await signInMutation.mutate({ ...data, usernameOrEmail: data.username })
    }

    const switchMessage = signType === "signup"
        ? <>Already have an account? <u>Sign in</u> </>
        : <>Don't have an account? <u>Sign up now</u></>

    const isError = mutation.isError || googleSignMutation.isError
    const signButtonText = signType === "signup" ? "Get Started" : "Login"
    const isPendingAuth = mutation.isLoading || googleSignMutation.isLoading

    useEffect(() => {
        if (!mutation.error) return
        setErrorMessage(prev => {
            return { ...prev, [signType]: mutation.error?.message }
        })
    }, [mutation.error])

    useEffect(() => {
        if (!googleSignMutation.error) return
        setErrorMessage(prev => {
            return { ...prev, [signType]: googleSignMutation.error?.message }
        })
    }, [googleSignMutation.error])

    useEffect(() => {
        if (!mutation.isLoading && !googleSignMutation.isLoading) {
            setClosable(true)
            return;
        }
        setClosable(false)
    }, [mutation.isLoading, googleSignMutation.isLoading])

    return (
        <form
            className={styles.form}
            onSubmit={signType === "signup" ? signUpForm.handleSubmit(onSignUpHandler) : signInForm.handleSubmit(onSignInHandler)}
            noValidate
            spellCheck={false}>
            <div className={styles.fields}>
                {signType === "signup" && (
                    <SignUpFields form={signUpForm} />
                )}
                {signType === "signin" && (
                    <SignInFields form={signInForm} />
                )}
            </div>
            {isError && errorMessage[signType] && !isPendingAuth && (
                <p className={styles.message}>{errorMessage[signType]}</p>
            )}
            {!isPendingAuth && (
                <button
                    type="button"
                    className={styles.switch}
                    onClick={switchHandler}>
                    {switchMessage}
                </button>
            )}
            {!googleSignMutation.isLoading && (
                <InteractiveButton
                    disabled={isPendingAuth}
                    type="submit"
                    status={mutation.isLoading ? "loading" : "normal"}>
                    {signButtonText}
                </InteractiveButton>
            )}
            {!mutation.isLoading && (
                <div className={styles.join}>
                    {!googleSignMutation.isLoading && <small> or </small>}
                    <AuthWithButton
                        disabled={isPendingAuth}
                        status={googleSignMutation.isLoading ? "loading" : "normal"}
                        type="button"
                        onClick={() => googleSignMutation.authWithGoogle()}>
                        Sign with Google
                    </AuthWithButton>
                </div>
            )}
        </form >
    )
}
