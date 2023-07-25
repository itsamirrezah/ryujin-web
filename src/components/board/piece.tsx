import { PieceType, SquareType } from "@/lib/play/types";
import { DEFAULT_PIECES, DND_ITEM_TYPE } from "./consts"
import { useDrag } from "react-dnd";
import styles from "./piece.module.css"
import { useBoard } from "./board-context";

type PieceProps = {
    piece: PieceType,
    square: SquareType
}

export default function Piece({ piece, square }: PieceProps) {
    const { isPieceDraggable, onPieceDrag, setSelectedSquare } = useBoard()
    const PieceComponent = DEFAULT_PIECES[piece];

    function onPieceSelected(piece: PieceType, square: SquareType) {
        setSelectedSquare(square)
        onPieceDrag(piece, square)
    }

    const [{ isDragging, canDrag }, ref] = useDrag(() => ({
        type: DND_ITEM_TYPE,
        item: () => {
            onPieceSelected(piece, square)
            return { from: square }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            canDrag: isPieceDraggable(piece)
        }),
    }), [piece, isPieceDraggable, onPieceDrag])

    return (
        <div ref={canDrag ? ref : undefined} className={`${styles.piece} ${isDragging ? styles.dragging : ""}`}
            onClick={() => canDrag ? onPieceSelected(piece, square) : null}>
            <PieceComponent />
        </div>
    )

}
