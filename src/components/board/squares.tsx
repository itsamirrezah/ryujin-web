import { useBoard } from "./board-context"
import { BOARD_SIZE, COLUMNS } from "./consts"
import Piece from "./piece"
import Square from "./square"
import { SquareType } from "@/lib/play/types"
import styles from "./squares.module.css"

export default function Sqaures() {
    const { currentPosition, currentView, moveOptions } = useBoard()
    return (
        <div className={styles.board}>
            {
                [...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
                    const row = Math.floor(i / BOARD_SIZE)
                    const col = i % BOARD_SIZE
                    const square = currentView === "w" ?
                        COLUMNS[col] + (BOARD_SIZE - row) as SquareType :
                        COLUMNS[BOARD_SIZE - 1 - col] + (row + 1) as SquareType
                    const piece = currentPosition[square]
                    const squareColor = row % 2 === col % 2 ? "white" : "black"
                    return (
                        <Square key={i} square={square} color={squareColor} hasPiece={!!piece}>
                            {piece && <Piece piece={piece} square={square} />}
                        </Square>
                    )
                })
            }
        </div >
    )
}
