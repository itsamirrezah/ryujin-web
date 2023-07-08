import { PieceType, SquareType } from "./types"
import { DEFAULT_PIECES, DND_ITEM_TYPE } from "./consts"
import { useDrag } from "react-dnd";
import styles from "./piece.module.css"
import { useBoard } from "./board-context";

type PieceProps = {
    piece: PieceType,
    square: SquareType
}

export default function Piece({ piece, square }: PieceProps) {
    const { isAllowedToMove } = useBoard()
    const PieceComponent = DEFAULT_PIECES[piece];

    const [{ isDragging, canDrag }, ref] = useDrag(() => ({
        type: DND_ITEM_TYPE,
        item: { from: square },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            canDrag: isAllowedToMove(piece)
        }),
    }), [piece, isAllowedToMove])

    return (
        <div ref={canDrag ? ref : undefined} className={styles.piece}>
            <PieceComponent />
        </div>
    )

}
