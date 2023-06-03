import { useBoard } from "./board-context"
import { BOARD_SIZE } from "./consts"
import Square from "./square"

export default function Sqaures() {
    const { position } = useBoard()
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[...Array(BOARD_SIZE)].map((_, i) => {
                return (
                    <div className="row" key={i} style={{ display: "flex", gap: 2 }}>
                        {[...Array(BOARD_SIZE)].map((_, j) => {
                            return <Square key={(i * BOARD_SIZE) + j} />
                        })}
                    </div>
                )
            })}
        </div>
    )
}
