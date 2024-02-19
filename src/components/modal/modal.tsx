import { ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import styles from "./modal.module.css"

type ModalProps = {
    children: ReactNode
}

export default function Modal({ children }: ModalProps) {
    const modalElement: HTMLElement = document.getElementById("modal") as HTMLElement;
    const [isShow, setShow] = useState(false)

    useEffect(() => {
        if (isShow) return;
        const timeout = setTimeout(() => {
            setShow(true)
        }, 0)
        return () => clearTimeout(timeout)
    }, [])

    const showAnimation = isShow ? styles.show : ""
    return (
        createPortal(
            <>
                <div className={styles.backdrop}></div>
                <div className={`${styles.content} ${showAnimation}`}>{children}</div>
            </>,
            modalElement
        )
    )
}
