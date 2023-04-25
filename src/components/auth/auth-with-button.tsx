import Google from "../icons/google"
import styles from "./auth-with-button.module.css"

interface IAuthWithButtonProps {
    children: string
}
export default function AuthWithButton({children}: IAuthWithButtonProps){
    return (
        <button className={styles.button}>
            <span className={styles.icon}><Google/></span>
            <span className={styles.text}>{children}</span>
        </button>
    )
}
