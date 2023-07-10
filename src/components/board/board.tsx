import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
import { PieceType, PlayerView, Position } from "./types"

type IBoardProps = {
    position?: Position
    isAllowedToMove: (piece: PieceType) => boolean
    currentView?: PlayerView
}
export default function Board({ position, isAllowedToMove, currentView }: IBoardProps) {
    return (
        <BoardContextProvider currentPosition={position} isAllowedToMove={isAllowedToMove} currentView={currentView}>
            <DndProvider backend={HTML5Backend}>
                <Sqaures />
            </DndProvider>
        </BoardContextProvider>
    )
}
