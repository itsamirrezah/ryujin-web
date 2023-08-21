import { forwardRef, InputHTMLAttributes } from "react";
import styles from "./field.module.css"

type FieldProps = {
    hasError?: boolean
    helperText?: string,
    hasSuccess?: boolean,
} & InputHTMLAttributes<HTMLInputElement>

const Field = forwardRef<
    HTMLInputElement,
    FieldProps
>(({ hasError = false, hasSuccess = false, helperText = "", placeholder, name, ...props }, ref) => {
    return (
        <div className={`${styles.container} ${hasError ? styles.error : hasSuccess ? styles.success : ""}`}>
            <label className={styles.field} htmlFor={name}>
                <input ref={ref} id={name} name={name} {...props} />
                <span className={styles.placeholder}>{placeholder}</span>
            </label>
            <span className={styles.helper}>{helperText}</span>
        </div>
    );
})

export default Field;
