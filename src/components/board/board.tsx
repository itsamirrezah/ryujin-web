import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
import { PieceType, Position } from "./types"

type IBoardProps = {
    position: Position | undefined
    isAllowedToMove: (piece: PieceType) => boolean
}
export default function Board({ position, isAllowedToMove }: IBoardProps) {
    return (
        <BoardContextProvider currentPosition={position} isAllowedToMove={isAllowedToMove}>
            <DndProvider backend={HTML5Backend}>
                <Sqaures />
            </DndProvider>
        </BoardContextProvider>
    )
}
