import { ButtonHTMLAttributes } from "react";
import styles from "./game-over-button.module.css"

export default function GameOverButton({ children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button className={styles.button} {...rest}>{children}</button>
}
