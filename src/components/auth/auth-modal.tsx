import Modal from "@/components/modal/modal"
import { useState } from "react"
import H2 from "../h/h2"
import Close from "../icons/close"
import styles from "./auth-modal.module.css"
import SignInForm from "./signin-form"
import SignUpForm from "./signup-form"

interface IAuthModalType {
    onClose: () => void;
}

export type SignOption = "signin" | "signup"

export default function AuthModal({ onClose }: IAuthModalType) {
    const [signType, setSignType] = useState<SignOption>("signin")

    function setSignTypeHandler(signOption: SignOption) {
        setSignType(signOption)
    }

    return (
        <Modal>
            <div className={styles.container}>
                <H2>{signType === "signup" ? "Sign Up" : "Sign In"}</H2>
                {signType === "signup" ?
                    <SignUpForm setSignType={setSignTypeHandler} onClose={onClose} /> :
                    <SignInForm setSignType={setSignTypeHandler} onClose={onClose} />
                }
                <button className={styles.close} onClick={onClose}>
                    <Close />
                </button>
            </div>
        </Modal>
    )
}
