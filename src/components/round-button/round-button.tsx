import { ButtonHTMLAttributes } from "react";
import styles from "./round-button.module.css"

type RoundButtonProps = {
   theme?: "red" | "green";
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function RoundButton({ theme = "green", children, ...rest }: RoundButtonProps) {
   return <button className={`${styles.button} ${styles[theme]}`} {...rest}>{children}</button>;
}
