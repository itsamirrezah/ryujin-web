import { ReactNode } from "react"
import { useDrop } from "react-dnd"
import { useBoard } from "./board-context"
import { DND_ITEM_TYPE } from "./consts"
import { DndItem, SquareType } from "./types"
import styles from "./square.module.css"

type SquareProps = {
    square: SquareType,
    color: "white" | "black",
    children: ReactNode
}

export default function Square({ square, children, color }: SquareProps) {
    const { movePiece, moveOptions } = useBoard()
    const [{ canDrop, isOver }, ref] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: DndItem) => {
            if (!moveOptions?.includes(square)) return;
            movePiece(item.from, square)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [square, movePiece])

    return (
        <div ref={ref} className={`${styles.sqaure} ${styles[`bg-${color}`]}`} style={{ position: "relative" }}>
            {moveOptions?.includes(square) && <span style={{ width: 20, height: 20, backgroundColor: "gray", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}></span>}
            {children}
        </div>
    )
}
