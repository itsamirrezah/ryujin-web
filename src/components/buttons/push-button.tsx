import { ButtonHTMLAttributes } from "react";
import styles from "./push-button.module.css";

export default function PushButton({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...rest} className={`${styles.button} ${className}`}>{children}</button>
    )
}
