import { PieceType, SquareType } from "./types"
import { DEFAULT_PIECES, DND_ITEM_TYPE } from "./consts"
import { useDrag } from "react-dnd";
import styles from "./piece.module.css"

type PieceProps = {
    piece: PieceType,
    square: SquareType
}

export default function Piece({ piece, square }: PieceProps) {
    const PieceComponent = DEFAULT_PIECES[piece];
    const [{ isDragging }, ref] = useDrag(() => ({
        type: DND_ITEM_TYPE,
        item: { from: square },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }))

    return (
        <div ref={ref} className={styles.piece}>
            <PieceComponent />
        </div>
    )

}
