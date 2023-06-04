import { ReactNode } from "react"
import { useDrop } from "react-dnd"
import { DND_ITEM_TYPE } from "./consts"
import { SquareType } from "./types"

type SquareProps = {
    square: SquareType,
    children: ReactNode
}

export default function Square({ square, children }: SquareProps) {
    function onDropped(item: any) {
        console.log(item)
    }
    const [{ canDrop, isOver }, ref] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: onDropped,
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
