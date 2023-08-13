import Modal from "@/components/modal/modal"
import { useGoogleAuth } from "@/lib/service/use-google-auth"
import { sign } from "crypto"
import { useEffect, useState } from "react"
import H2 from "../h/h2"
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

    function setSignTypeHandler(signOption: SignOption) {
        setSignType(signOption)
    }

    useEffect(() => {
        setSignType(signOption)
    }, [signOption])

    return (
        <Modal>
            <div className={styles.container}>
                <H2>{signType === "signup" ? "Sign Up" : signType === "signin" ? "Sign In" : "Update Profile"}</H2>
                {signType === "signup" ?
                    <SignUpForm setSignType={setSignTypeHandler} onClose={onClose} /> :
                    signType === "signin" ?
                        <SignInForm setSignType={setSignTypeHandler} onClose={onClose} /> :
                        <UsernameForm />
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
