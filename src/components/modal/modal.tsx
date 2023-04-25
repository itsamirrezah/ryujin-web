import { ReactNode } from "react"
import { createPortal } from "react-dom"
import styles from "./modal.module.css"

interface IModalProps {
    children: ReactNode
}

export default function Modal({children}: IModalProps) {
    const modalElement: HTMLElement = document.getElementById("modal") as HTMLElement;

    return (
        createPortal(
            <>
                <div className={styles.backdrop}></div>
                <div className={styles.content}>{children}</div>
            </>, 
            modalElement
        )
    )
}
