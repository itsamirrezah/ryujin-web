import { ButtonHTMLAttributes } from "react";
import styles from "./play-button.module.css";

export default function PlayButton({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...rest} className={`${styles.button} ${styles.redtogreen} ${className}`}>{children}</button>
    )
}
