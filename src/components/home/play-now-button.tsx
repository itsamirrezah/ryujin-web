import { ButtonHTMLAttributes } from "react";
import PushButton from "../buttons/push-button";
import styles from "./play-now-button.module.css"

export default function PlayNowButton({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <PushButton className={`${styles.bgRedToGreen} ${className}`} {...rest}>
            {children}
        </PushButton>
    )
}
