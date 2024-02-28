import { ButtonHTMLAttributes } from "react";
import PushButton from "../buttons/push-button";
import styles from "./side-bar-button.module.css"

type PlayActionButtonProps = {
    icon: JSX.Element
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SideBarButton({ children, icon, ...rest }: PlayActionButtonProps) {
    return (
        <PushButton {...rest} className={`${styles.button} ${styles.navy}`}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.text}>{children}</span>
        </PushButton>
    )
}
