import Modal from "@/components/modal/modal"
import { useAuthContext } from "@/lib/auth"
import { useGoogleAuth } from "@/lib/service/use-google-auth"
import { useEffect, useState } from "react"
import Close from "../icons/close"
import styles from "./auth-modal.module.css"
import AuthWithButton from "./auth-with-button"
import SignInForm from "./signin-form"
import SignUpForm from "./signup-form"
import UsernameForm from "./username-form"

type AuthModalProps = {
    onClose: () => void;
    signOption?: SignOption
}

export type SignOption = "signin" | "signup" | "username" | "email"

export default function AuthModal({ onClose, signOption = "signup" }: AuthModalProps) {
    const [signType, setSignType] = useState<SignOption>(signOption)
    const { isError, userInfo, googleAuthHandler, isSuccess } = useGoogleAuth()
    const { user } = useAuthContext()

    function setSignTypeHandler(signOption: SignOption) {
        setSignType(signOption)
    }

    useEffect(() => {
        setSignType(signOption)
    }, [signOption])

    const signupDescription = "Immerse yourself in a world where tactics are paramount. Join us to conquer the arena!"
    const usernameDescription = "to get started, please create a unique username. Your username will be how other members identify you. Let's begin your journey!"
    const emailDescription = "Thank you for joining Ryujin! We've sent a confirmation link to your inbox. Please verify your account by clicking on the verification link we've sent you. We're excited to have you onboard!"
    return (
        <Modal>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h2>
                        {signType === "signup" ? "Craft, Clash, Conquer!"
                            : signType === "signin" ? "Sign in"
                                : signOption === "username" ? "Choose Your Username"
                                    : "Confirm Your Email"
                        }</h2>
                    <p>
                        {signType === "signup" ? signupDescription : signType === "username" ? usernameDescription : emailDescription}
                    </p>
                </div>
                {signType === "signup" ?
                    <SignUpForm setSignType={setSignTypeHandler} onClose={onClose} /> :
                    signType === "signin" ?
                        <SignInForm setSignType={setSignTypeHandler} onClose={onClose} /> :
                        signType === "username" && !!user ?
                            <UsernameForm userId={user.id} /> :
                            null
                }
                {(signType === "signup" || signType === "signin") && (<div className={styles.join}>
                    <small> or </small>
                    <AuthWithButton type="button" onClick={() => googleAuthHandler()}>Sign with Google</AuthWithButton>
                </div>)}
                <button className={styles.close} onClick={onClose}>
                    <Close />
                </button>
            </div>
        </Modal>
    )
}
