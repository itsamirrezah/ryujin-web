import { forwardRef, InputHTMLAttributes } from "react";
import styles from "./field.module.css"

const Field = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
    return (
        <label className={styles.container} htmlFor={props.name}>
            <input ref={ref} className={styles.input} id={props.name} name={props.name} {...props} />
        </label>
    );
})

export default Field;
