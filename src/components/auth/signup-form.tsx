import Field from "./field"
import RoundButton from "../round-button/round-button"
import AuthWithButton from "./auth-with-button"
import styles from "./auth-modal.module.css"

export default function SignUpForm(){
    return (
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
    )
}
