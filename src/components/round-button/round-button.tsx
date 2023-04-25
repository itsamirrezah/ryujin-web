import { ButtonHTMLAttributes } from "react";
import styles from "./round-button.module.css"

interface IRoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: "red" | "green";
}
export default function RoundButton({theme = "green", children, ...rest}: IRoundButtonProps ){
   return <button className={`${styles.button} ${styles[theme]}`} {...rest}>{children}</button>; 
}
