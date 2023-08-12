import Modal from "@/components/modal/modal"
import { useGoogleAuth } from "@/lib/service/use-google-auth"
import { useEffect, useState } from "react"
import H2 from "../h/h2"
import Close from "../icons/close"
import styles from "./auth-modal.module.css"
import AuthWithButton from "./auth-with-button"
import SignInForm from "./signin-form"
import SignUpForm from "./signup-form"

type AuthModalProps = {
    onClose: () => void;
}

export type SignOption = "signin" | "signup"

export default function AuthModal({ onClose }: AuthModalProps) {
    const [signType, setSignType] = useState<SignOption>("signin")
    const { isError, userInfo, googleAuthHandler, isSuccess } = useGoogleAuth()

    function setSignTypeHandler(signOption: SignOption) {
        setSignType(signOption)
    }

    useEffect(() => {
        if (!isSuccess) return
        onClose()
    }, [isSuccess])

    return (
        <Modal>
            <div className={styles.container}>
                <H2>{signType === "signup" ? "Sign Up" : "Sign In"}</H2>
                {signType === "signup" ?
                    <SignUpForm setSignType={setSignTypeHandler} onClose={onClose} /> :
                    <SignInForm setSignType={setSignTypeHandler} onClose={onClose} />
                }
                <div className={styles.join}>
                    <small> or </small>
                    <AuthWithButton type="button" onClick={() => googleAuthHandler()}>Sign with Google</AuthWithButton>
                </div>
                <button className={styles.close} onClick={onClose}>
                    <Close />
                </button>
            </div>
        </Modal>
    )
}
