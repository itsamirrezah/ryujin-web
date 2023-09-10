import { ButtonHTMLAttributes } from "react";
import PlayButton from "./play-button";
import styles from "./play-action-button.module.css"

type PlayActionButtonProps = {
    icon: JSX.Element
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function PlayActionButton({ children, icon, ...rest }: PlayActionButtonProps) {
    return <PlayButton {...rest} className={`${styles.button} ${styles.navy}`}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.text}>{children}</span>
    </PlayButton>
}
