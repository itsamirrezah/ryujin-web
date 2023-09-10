import { ButtonHTMLAttributes } from "react";
import PushButton from "../buttons/push-button";
import styles from "./play-now-button.module.css"

export default function PlayNowButton({ children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <PushButton className={styles.redtogreen} {...rest}>
            {children}
        </PushButton>
    )
}