import { ButtonHTMLAttributes } from "react";
import styles from "./sign-button.module.css";

export type SignButtonProps = {
    status?: "normal" | "loading" | "succeed" | "failed"
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function SignButton({ status = "normal", className, children, ...rest }: SignButtonProps) {
    return <button className={`${styles.button} ${styles[status]} ${className}`} {...rest}>{children}</button>;
}
