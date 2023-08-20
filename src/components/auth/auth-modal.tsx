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

export type SignOption = "signin" | "signup" | "username"

export default function AuthModal({ onClose, signOption = "signin" }: AuthModalProps) {
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
    return (
        <Modal>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h2>{signType === "signup" ? "Craft, Clash, Conquer!" : signType === "signin" ? "Sign in" : "Choose Your Username"}</h2>
                    <p>
                        {signType === "signup" ? signupDescription : signType === "username" ? usernameDescription : ""}
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
                {signType !== "username" && (<div className={styles.join}>
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
