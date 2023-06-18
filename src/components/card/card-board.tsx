import { BOARD_SIZE, COLUMNS } from "../board/consts"
import { SquareType } from "../board/types"
import styles from "./card-board.module.css"

type CardBoardProps = {
    options: number[]
}

export default function CardBoard({ options }: CardBoardProps) {
    return (
        <div className={styles.board}>
            {
                [...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
                    const row = Math.floor(i / BOARD_SIZE)
                    const col = i % BOARD_SIZE
                    const square = COLUMNS[col] + (BOARD_SIZE - row) as SquareType
                    const squareColor = row % 2 === col % 2 ? "white" : "black"
                    const isCenter = row === 2 && col === 2;
                    return (
                        <div key={i} className={`${styles.sqaure} ${styles[`bg-${squareColor}`]}`}>
                            {isCenter && <div style={{ backgroundColor: "#303456", width: "100%", height: "100%" }}></div>}
                            {options.includes(i) && <div style={{ backgroundColor: "#C00C0CD1", width: "100%", height: "100%" }}></div>}
                        </div>
                    )
                })
            }
        </div>
    )
}
