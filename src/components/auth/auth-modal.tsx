import Modal from "@/components/modal/modal"
import H2 from "../h/h2"
import RoundButton from "../round-button/round-button"
import styles from "./auth-modal.module.css"
import AuthWithButton from "./auth-with-button"
import Field from "./field"

export default function AuthModal(){
    return (
        <Modal>
            <div className={styles.container}>
               <H2>Sign Up</H2> 
               <form className={styles.form}>
                   <Field placeholder="Username"/>
                   <Field placeholder="Email"/>
                   <Field placeholder="Password" type="password" />
                   <RoundButton theme="red">Join us</RoundButton>
               </form>
               <span> or </span>
                   <AuthWithButton>Sign Up with Google</AuthWithButton>
            </div>
        </Modal>
    )
}
