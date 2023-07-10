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
    const { onMove } = useBoard()
    const [{ canDrop, isOver }, ref] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: DndItem) => onMove(item.from, square),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [square])

    return (
        <div ref={ref} className={`${styles.sqaure} ${styles[`bg-${color}`]}`} >
            {children}
        </div>
    )
}
