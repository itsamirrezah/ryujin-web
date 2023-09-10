import { ButtonHTMLAttributes } from "react";
import styles from "./interactive-button.module.css";

export type InteractiveButtonProps = {
    status?: "normal" | "loading" | "succeed" | "failed"
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function InteractiveButton({ status = "normal", className, children, ...rest }: InteractiveButtonProps) {
    return <button className={`${styles.button} ${styles[status]} ${className}`} {...rest}>{children}</button>;
}
