import { ButtonHTMLAttributes } from "react";
import styles from "./round-button.module.css"

export default function RoundButton({children}: ButtonHTMLAttributes<HTMLButtonElement>){
   return <button className={`${styles.button} ${styles.green}`}>{children}</button>; 
}
