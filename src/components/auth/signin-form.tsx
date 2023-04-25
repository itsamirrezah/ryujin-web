import RoundButton from "../round-button/round-button"
import Field from "./field"
import AuthWithButton from "./auth-with-button"
import styles from "./auth-modal.module.css"

export default function SignInForm(){
    return (
       <form className={styles.form}>
           <div className={styles.fields}>
               <Field placeholder="Username or Email" />
               <Field placeholder="Password" type="password" />
           </div>
           <button className={styles.forgot}>Forgot your <span>password</span> ?</button>
           <div className={styles.join}>
               <RoundButton theme="red">Login</RoundButton>
               <small> or </small>
               <AuthWithButton>Sign In with Google</AuthWithButton>
           </div>
       </form>
    )
}
