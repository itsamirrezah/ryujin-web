import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
import { Position } from "./types"

type IBoardProps = {
    position: Position | undefined
}
export default function Board({ position }: IBoardProps) {
    return (
        <BoardContextProvider currentPosition={position}>
            <DndProvider backend={HTML5Backend}>
                <Sqaures />
            </DndProvider>
        </BoardContextProvider>
    )
}
