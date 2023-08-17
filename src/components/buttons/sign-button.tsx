import { ButtonHTMLAttributes, useEffect, useState } from "react";
import styles from "./sign-button.module.css";

type SignButtonProps = {
    status?: "normal" | "loading" | "succeed" | "failed"
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function SignButton({ status = "normal", children, ...rest }: SignButtonProps) {
    return <button className={`${styles.button} ${styles[status]}`} {...rest}>{children}</button>;
}
