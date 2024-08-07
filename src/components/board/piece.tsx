import { PieceType, SquareType } from "@/lib/play/types";
import { CSSProperties, useEffect, useState } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import { useBoard } from "./board-context";
import { DEFAULT_PIECES, DND_ITEM_TYPE } from "./consts";
import styles from "./piece.module.css";

type PieceProps = {
    piece: PieceType,
    square: SquareType
}

export default function Piece({ piece, square }: PieceProps) {
    const [animationStyle, setAnimationStyle] = useState<CSSProperties>({})
    const {
        isPieceDraggable,
        onPieceDrag,
        setSelectedSquare,
        isWaitForAnimation,
        nextMove,
        animationDuration,
        coordinates,
        currentPosition
    } = useBoard()

    const PieceComponent = DEFAULT_PIECES[piece];

    function onPieceSelected(piece: PieceType, square: SquareType) {
        setSelectedSquare(square)
        onPieceDrag(piece, square)
    }

    useEffect(() => {
        if (!isWaitForAnimation || nextMove?.from !== square || !nextMove.to) return
        const source = coordinates?.[nextMove.from]
        const dest = coordinates?.[nextMove.to]
        if (!source || !dest) return;
        setAnimationStyle(prev => {
            return {
                ...prev,
                transform: `translate(${dest.x - source.x}px, ${dest.y - source.y}px)`,
                transition: `transform ${animationDuration}ms`,
                zIndex: 9
            }
        })

    }, [nextMove])

    const [{ isDragging, canDrag }, ref, preview] = useDrag(() => ({
        type: DND_ITEM_TYPE,
        item: () => {
            onPieceSelected(piece, square)
            return { from: square, piece: piece }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            canDrag: isPieceDraggable(piece)
        }),
    }), [piece, isPieceDraggable, onPieceDrag])

    useEffect(() => {
        const pieceCoord = coordinates?.[square]
        if (!pieceCoord) return;
        setAnimationStyle((prev) => {
            return {
                ...prev,
                transform: "translate(0px,0px)",
                transition: "transform 0ms",
                zIndex: 1
            }
        })

    }, [currentPosition])

    preview(getEmptyImage(), { captureDraggingState: true });

    return (
        <div
            ref={canDrag ? ref : undefined}
            style={animationStyle}
            className={`${styles.piece} ${isDragging ? styles.isDragging : ""}`}
            onClick={() => canDrag ? onPieceSelected(piece, square) : null}>
            <PieceComponent />
        </div >
    )

}
