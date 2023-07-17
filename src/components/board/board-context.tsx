import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { DEFAULT_POSITION } from "@/lib/play/consts";
import { PieceType, BlackOrWhite, Position, SquareType } from "@/lib/play/types";

export type BoardProps = {
    currentPosition?: Position
    currentView?: BlackOrWhite,
    isPieceDraggable?: (piece: PieceType) => boolean
    onPieceDrag?: (piece: PieceType, square: SquareType) => void
    onPieceDrop?: (square: SquareType) => void
    moveOptions?: SquareType[]
    children: ReactNode
}

type RequiredBoardProps = Required<BoardProps>

type BoardValues = {
    currentPosition: RequiredBoardProps["currentPosition"],
    currentView: RequiredBoardProps["currentView"]
    isPieceDraggable: RequiredBoardProps["isPieceDraggable"]
    onPieceDrag: RequiredBoardProps["onPieceDrag"]
    onPieceDrop: RequiredBoardProps["onPieceDrop"]
    moveOptions: RequiredBoardProps["moveOptions"]
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({
    children,
    currentPosition = DEFAULT_POSITION,
    currentView = "w",
    isPieceDraggable = () => true,
    onPieceDrag = () => { },
    onPieceDrop = () => { },
    moveOptions = [],
}: BoardProps) {
    const [playerView, setPlayerView] = useState<BlackOrWhite>(currentView)

    useEffect(() => {
        setPlayerView(currentView)
    }, [currentView])

    return (
        <BoardContext.Provider
            value={{
                currentPosition,
                currentView: playerView,
                isPieceDraggable,
                onPieceDrag,
                onPieceDrop,
                moveOptions
            }}>
            {children}
        </BoardContext.Provider>
    )
}

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) throw new Error("useBoard must be used within a BoardContextProvider")
    return context
}
