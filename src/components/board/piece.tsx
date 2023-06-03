import { PieceType } from "./types"
import { DEFAULT_PIECES } from "./consts"

type PieceProps = {
    piece: PieceType
}

export default function Piece({ piece }: PieceProps) {
    const PieceComponent = DEFAULT_PIECES[piece];
    return (
        <div style={{ width: 124, height: 124, border: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <PieceComponent />
        </div>
    )

}
