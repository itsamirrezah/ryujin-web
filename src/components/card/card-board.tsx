import { BOARD_SIZE, COLUMNS } from "../board/consts"
import { SquareType } from "../board/types"
import styles from "./card-board.module.css"

export default function CardBoard() {
    return (
        <div className={styles.board}>
            {
                [...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
                    const row = Math.floor(i / BOARD_SIZE)
                    const col = i % BOARD_SIZE
                    const square = COLUMNS[col] + (BOARD_SIZE - row) as SquareType
                    const squareColor = row % 2 === col % 2 ? "white" : "black"
                    return (
                        <div key={i} className={`${styles.sqaure} ${styles[`bg-${squareColor}`]}`}>

                        </div>
                    )
                })
            }
        </div>
    )
}
