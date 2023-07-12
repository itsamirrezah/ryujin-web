import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
import { PieceType, PlayerView, Position, SquareType } from "./types"

type IBoardProps = {
    position?: Position
    isAllowedToMove: (piece: PieceType) => boolean
    currentView?: PlayerView,
    onPieceSelected: (square: SquareType) => void
}
export default function Board({ position, isAllowedToMove, currentView, onPieceSelected }: IBoardProps) {
    return (
        <BoardContextProvider
            currentPosition={position}
            isAllowedToMove={isAllowedToMove}
            currentView={currentView}
            onPieceSelected={onPieceSelected}
        >
            <DndProvider backend={HTML5Backend}>
                <Sqaures />
            </DndProvider>
        </BoardContextProvider>
    )
}
