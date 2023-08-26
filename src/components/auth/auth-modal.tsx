import Modal from "@/components/modal/modal"
import { useAuthContext } from "@/lib/auth"
import { useGoogleAuth } from "@/lib/service/use-google-auth"
import useRegisterUser from "@/lib/service/use-register-user"
import useSignIn from "@/lib/service/use-signin"
import useUpdateUsername from "@/lib/service/use-update-username"
import { SignSchema, SignUpSchema, signInSchema, signUpSchema, usernameSchema, UpdateUsernameSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Close from "../icons/close"
import styles from "./auth-modal.module.css"
import AuthWithButton from "./auth-with-button"
import { authModalPrompts } from "./consts"
import SignInForm from "./signin-form"
import SignUpForm from "./signup-form"
import UsernameForm from "./username-form"

export type SignOption = "signin" | "signup" | "username" | "email"

type AuthModalProps = {
    isShown: boolean,
    onClose: () => void,
    signOption?: SignOption,
}

export default function AuthModal({ onClose, signOption = "signup", isShown }: AuthModalProps) {
    const [signType, setSignType] = useState<SignOption>(signOption)
    const { user } = useAuthContext()
    const signInForm = useForm<SignSchema>({ mode: "onBlur", resolver: zodResolver(signInSchema) })
    const signUpForm = useForm<SignUpSchema>({ mode: "onBlur", resolver: zodResolver(signUpSchema) })
    const updateUsernameForm = useForm<UpdateUsernameSchema>({
        mode: "all",
        resolver: zodResolver(usernameSchema),
        defaultValues: { username: "" }
    })
    const { isError, googleAuthHandler, isLoading, isSuccess } = useGoogleAuth()
    const signInHandler = useSignIn()
    const registerHandler = useRegisterUser()
    const updateUsernameHandler = useUpdateUsername(user?.id)
    const isClosable = !signInHandler.isLoading && !registerHandler.isLoading && !updateUsernameHandler.isLoading
    const isGoogleLoginAllowed = signType === "signup" || signType === "signin"
    const { title, description } = authModalPrompts[signType]

    useEffect(() => {
        setSignType(signOption)
    }, [signOption])

    if (!isShown) return null
    return (
        <Modal>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
                {signType === "signup" && (
                    <SignUpForm
                        switchSign={() => setSignType("signin")}
                        form={{ ...signUpForm }}
                        handler={{ ...registerHandler }}
                    />)}
                {signType === "signin" && (
                    <SignInForm
                        switchSign={() => setSignType("signup")}
                        form={{ ...signInForm }}
                        handler={{ ...signInHandler }}
                    />
                )}
                {signType === "username" && (
                    <UsernameForm
                        form={{ ...updateUsernameForm }}
                        handler={{ ...updateUsernameHandler }} />
                )}
                {isGoogleLoginAllowed && (
                    <div className={styles.join}>
                        <small> or </small>
                        <AuthWithButton
                            status={isLoading ? "loading" : "normal"}
                            type="button"
                            onClick={() => googleAuthHandler()}>
                            Sign with Google
                        </AuthWithButton>
                    </div>
                )}
                {isClosable && <button className={styles.close} onClick={onClose}>
                    <Close />
                </button>}
            </div>
        </Modal>
    )
}
