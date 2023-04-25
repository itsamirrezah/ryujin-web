import { InputHTMLAttributes } from "react";
import styles from "./field.module.css"

export default function Field({name, ...rest}: InputHTMLAttributes<HTMLInputElement>){
    return (
        <label className={styles.container} htmlFor={name}>
            <input className={styles.input} id={name} name={name} {...rest} />
        </label>
    );
}
