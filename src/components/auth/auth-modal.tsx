import Modal from "@/components/modal/modal"
import { useAuthContext } from "@/lib/auth"
import {
    signInSchema,
    SignSchema,
    SignUpSchema,
    signUpSchema,
    UpdateUsernameSchema,
    usernameSchema
} from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Close from "../icons/close"
import styles from "./auth-modal.module.css"
import { authModalPrompts } from "./consts"
import EmailConfirmationHandler from "./email-confirmation-handler"
import SignForm from "./sign-form"
import UsernameForm from "./username-form"

export type SignOption = "signin" | "signup" | "username" | "email"

type AuthModalProps = {
    isShown: boolean,
    onClose: () => void,
    signOption?: SignOption,
}

export default function AuthModal({ onClose, signOption = "signup", isShown }: AuthModalProps) {
    const [signType, setSignType] = useState<SignOption>(signOption)
    const [isClosable, setClosable] = useState(true)
    const signInForm = useForm<SignSchema>({ mode: "onBlur", resolver: zodResolver(signInSchema) })
    const signUpForm = useForm<SignUpSchema>({ mode: "onBlur", resolver: zodResolver(signUpSchema) })
    const updateUsernameForm = useForm<UpdateUsernameSchema>({
        mode: "onChange", resolver: zodResolver(usernameSchema),
        defaultValues: { username: "" }
    })
    const { user } = useAuthContext()
    const { title, description } = authModalPrompts[signType]

    useEffect(() => {
        setSignType(signOption)
    }, [signOption])

    const isSignForm = signType === "signin" || signType === "signup"

    if (!isShown) return null
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
            <Modal>
                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>
                    {isSignForm && (
                        <SignForm
                            signInForm={signInForm}
                            signUpForm={signUpForm}
                            signType={signType}
                            switchHandler={() => setSignType(prev => prev === "signin" ? "signup" : "signin")}
                            setClosable={(value: boolean) => setClosable(value)}
                        />
                    )}
                    {signType === "username" && user?.id && (
                        <UsernameForm
                            form={{ ...updateUsernameForm }}
                            setClosable={(value: boolean) => setClosable(value)}
                            userId={user.id}
                        />
                    )}
                    {signType === "email" && <EmailConfirmationHandler />}
                    {isClosable && (
                        <button className={styles.close} onClick={onClose}>
                            <Close />
                        </button>
                    )}
                </div>
            </Modal>
        </GoogleOAuthProvider>
    )
}
