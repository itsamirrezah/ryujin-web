import Modal from "@/components/modal/modal"
import H2 from "../h/h2"
import Close from "../icons/close"
import styles from "./auth-modal.module.css"
import SignInForm from "./signin-form"
import SignUpForm from "./signup-form"

interface IAuthModalType {
    signType: "signin" | "signup"
}

export default function AuthModal({signType = "signup" }: IAuthModalType){
    return (
        <Modal>
            <div className={styles.container}>
                <H2>{signType === "signup" ? "Sign Up" : "Sign In"}</H2> 
                {signType === "signup" ? <SignUpForm /> : <SignInForm />}
                <button className={styles.close}><Close/></button>
            </div>
        </Modal>
    )
}
