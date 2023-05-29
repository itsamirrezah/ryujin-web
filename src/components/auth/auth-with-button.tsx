import { ButtonHTMLAttributes } from "react"
import Google from "../icons/google"
import styles from "./auth-with-button.module.css"

interface IAuthWithButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: string
}
export default function AuthWithButton({ children, ...rest }: IAuthWithButtonProps) {
    return (
        <button className={styles.button} {...rest}>
            <span className={styles.icon}><Google /></span>
            <span className={styles.text}>{children}</span>
        </button>
    )
}
