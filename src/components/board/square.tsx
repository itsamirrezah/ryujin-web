import { ReactNode } from "react"
import { useDrop } from "react-dnd"
import { useBoard } from "./board-context"
import { DND_ITEM_TYPE } from "./consts"
import { DndItem, SquareType } from "./types"

type SquareProps = {
    square: SquareType,
    children: ReactNode
}

export default function Square({ square, children }: SquareProps) {
    const { onMove } = useBoard()

    const [{ canDrop, isOver }, ref] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: DndItem) => onMove(item.from, square),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    return (
        <div ref={ref} style={{ width: 124, height: 124, border: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {children}
        </div>
    )
}
