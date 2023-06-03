import { useBoard } from "./board-context"
import { BOARD_SIZE, COLUMNS } from "./consts"
import Piece from "./piece"
import Square from "./square"
import { Squares } from "./types"

export default function Sqaures() {
    const { position, playerView } = useBoard()
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[...Array(BOARD_SIZE)].map((_, i) => {
                return (
                    <div className="row" key={i} style={{ display: "flex", gap: 2 }}>
                        {[...Array(BOARD_SIZE)].map((_, j) => {
                            const square = playerView === "w" ?
                                COLUMNS[j] + (BOARD_SIZE - i) as Squares :
                                COLUMNS[BOARD_SIZE - 1 - j] + (i + 1) as Squares
                            const piece = position[square]
                            return (
                                <Square key={(i * BOARD_SIZE) + j} square={square}>
                                    {piece && <Piece piece={piece} />}
                                </Square>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
