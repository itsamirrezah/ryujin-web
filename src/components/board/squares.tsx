import { useBoard } from "./board-context"
import { BOARD_SIZE, COLUMNS } from "./consts"
import Piece from "./piece"
import Square from "./square"
import { SquareType } from "./types"
import styles from "./squares.module.css"

export default function Sqaures() {
    const { position, playerView } = useBoard()
    return (
        <div className={styles.board} style={{
            display: "grid", gridTemplateRows: "repeat(5, 1fr)", gridTemplateColumns: "repeat(5,1fr)",
        }}>
            {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
                const row = Math.floor(i / BOARD_SIZE)
                const col = i % BOARD_SIZE
                const square = playerView === "w" ?
                    COLUMNS[col] + (BOARD_SIZE - row) as SquareType :
                    COLUMNS[BOARD_SIZE - 1 - col] + (row + 1) as SquareType
                const piece = position[square]
                const squareColor = row % 2 === col % 2 ? "white" : "black"
                return (
                    <Square key={i} square={square} color={squareColor}>
                        {/**{piece && <Piece piece={piece} square={square} />}**/}
                    </Square>
                )
            })}
        </div>
    )
}
