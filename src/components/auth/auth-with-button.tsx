import { ButtonHTMLAttributes } from "react"
import Google from "../icons/google"
import styles from "./auth-with-button.module.css"

type AuthWithButtonProps = {
    children: string
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function AuthWithButton({ children, ...rest }: AuthWithButtonProps) {
    return (
        <button className={styles.button} {...rest}>
            <span className={styles.icon}><Google /></span>
            <span className={styles.text}>{children}</span>
        </button>
    )
}
