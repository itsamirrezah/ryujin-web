import Modal from "@/components/modal/modal"
import H2 from "../h/h2"
import Close from "../icons/close"
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
                   <div className={styles.fields}>
                       <Field placeholder="Username" /> 
                       <Field placeholder="Email" type="email" />
                       <Field placeholder="Password" type="password" />
                   </div>
                   <p className={styles.terms}>By continuing, you agree to Ryujin’s <a href="#">Terms of Service</a><br/>and acknowledge you've read our <a href="#">Privacy Policy</a></p>
                   <div className={styles.join}>
                       <RoundButton theme="red">Join us</RoundButton>
                       <small> or </small>
                       <AuthWithButton>Sign Up with Google</AuthWithButton>
                   </div>
               </form>
               <button className={styles.close}><Close/></button>
            </div>
        </Modal>
    )
}
