import { BlackOrWhite } from "@/lib/play/types"
import { BOARD_SIZE } from "../board/consts"
import styles from "./card-board.module.css"

type CardBoardProps = {
    options: number[]
    color: BlackOrWhite
}

export default function CardBoard({ options, color }: CardBoardProps) {
    return (
        <div className={styles.board}>
            {
                [...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
                    const squareColor = i % 2 == 0 ? "white" : "black"
                    const isCenter = i === Math.floor(BOARD_SIZE * BOARD_SIZE / 2)
                    const isOption = options.includes(i)
                    const optionStyles = isOption ? `${styles.option} ${styles[`option-${color}`]}` : ""
                    return (
                        <div key={i} className={`${styles.sqaure} ${styles[`bg-${squareColor}`]}`}>
                            {isCenter && <span className={`${styles.option} ${styles.center}`}></span>}
                            {isOption && <span className={optionStyles}></span>}
                        </div>
                    )
                })
            }
        </div>
    )
}
