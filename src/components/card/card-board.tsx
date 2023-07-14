import { BOARD_SIZE } from "../board/consts"
import styles from "./card-board.module.css"

type CardBoardProps = {
    options: number[]
}

export default function CardBoard({ options }: CardBoardProps) {
    return (
        <div className={styles.board}>
            {
                [...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
                    const squareColor = i % 2 == 0 ? "white" : "black"
                    const isCenter = i === Math.floor(BOARD_SIZE * BOARD_SIZE / 2)
                    return (
                        <div key={i} className={`${styles.sqaure} ${styles[`bg-${squareColor}`]}`}>
                            {isCenter && <span className={`${styles.option} ${styles.center}`}></span>}
                            {options.includes(i) && <span className={styles.option}></span>}
                        </div>
                    )
                })
            }
        </div>
    )
}
