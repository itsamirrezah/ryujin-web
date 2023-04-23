import Google from "../icons/google"
import styles from "./auth-with-button.module.css"

export default function AuthWithButton(){
    return (
        <button className={styles.button}>
            <span className={styles.icon}><Google/></span>
            <span className={styles.text}>Auth With Google</span>
        </button>
    )
}
