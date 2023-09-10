import InteractiveButton, { InteractiveButtonProps } from "../buttons/interactive-button"
import Google from "../icons/google"
import styles from "./auth-with-button.module.css"

export default function AuthWithButton({ children, ...rest }: InteractiveButtonProps) {
    const status = rest.status
    const buttonStyles = `${styles.button} ${status === "loading" ? styles.loading : ""}`
    return (
        <InteractiveButton{...rest} className={buttonStyles}>
            <span className={styles.icon}><Google /></span>
            <span className={styles.text}>{children}</span>
        </InteractiveButton>
    )
}
