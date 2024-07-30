import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./icon-action-button.module.css"

type IconActionButtonProps = {
    isSelected?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const IconActionButton = forwardRef<
    HTMLButtonElement,
    IconActionButtonProps
>(({ isSelected, className, ...rest }, ref) => {
    return (
        <button
            ref={ref}
            className={`${styles.container} ${isSelected ? styles.selected : ""} ${className}`}
            {...rest}
        >
        </ button>
    )
})

export default IconActionButton
