import { ReactNode } from "react"
import { useDrop } from "react-dnd"
import { useBoard } from "./board-context"
import { DND_ITEM_TYPE } from "./consts"
import { SquareType } from "@/lib/play/types"
import styles from "./square.module.css"
import MoveOption from "../icons/move-option"
import HitOption from "../icons/hit-option"

export type DndItem = { from: SquareType };

type SquareProps = {
    square: SquareType,
    color: "black" | "white",
    hasPiece: boolean,
    hasOption: boolean,
    children: ReactNode,

}

export default function Square({ square, hasPiece, hasOption, color, children }: SquareProps) {
    const { onPieceDrop, moveOptions } = useBoard()
    const [{ canDrop, isOver }, ref] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: DndItem) => {
            if (!moveOptions?.includes(square)) return;
            onPieceDrop(square)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [square, onPieceDrop])

    const hasWhiteTemple = square === "c1"
    const hasBlackTemple = square === "c5"
    const templeStyle = hasWhiteTemple ? styles['temple-w'] : styles['temple-b']

    return (
        <div ref={ref} onClick={() => hasOption ? onPieceDrop(square) : null} className={`${styles.sqaure} ${styles[`bg-${color}`]}`}>
            {hasOption && (
                <span className={`${styles.option} ${hasPiece ? styles.hit : ""}`}>
                    {hasPiece ? <HitOption /> : <MoveOption />}
                </span>
            )}
            {(hasWhiteTemple || hasBlackTemple) && <span className={`${styles.temple} ${templeStyle}`}></span>}
            {children}
        </div>
    )
}
