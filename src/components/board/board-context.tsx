import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { DEFAULT_POSITION } from "./consts";
import { PieceType, PlayerView, Position, SquareType } from "./types";

type BoardContextProviderProps = {
    currentPosition?: Position
    children: ReactNode
    isAllowedToMove: (piece: PieceType) => boolean
    currentView?: PlayerView,
    onPieceSelected: (piece: PieceType, square: SquareType) => void
    moveOptions: SquareType[] | undefined
    movePiece: (from: SquareType, to: SquareType) => void
}
type BoardValues = {
    position: Position,
    playerView: PlayerView
    movePiece: (from: SquareType, to: SquareType) => void
    isAllowedToMove: (piece: PieceType) => boolean
    onPieceSelected: (piece: PieceType, square: SquareType) => void
    moveOptions: SquareType[] | undefined
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({
    children,
    currentPosition = DEFAULT_POSITION,
    currentView = "w",
    isAllowedToMove,
    onPieceSelected,
    moveOptions,
    movePiece
}: BoardContextProviderProps) {
    const [position, setPosition] = useState<Position>(currentPosition)
    const [playerView, setPlayerView] = useState<PlayerView>(currentView)

    useEffect(() => {
        setPosition(currentPosition)
    }, [currentPosition])

    useEffect(() => {
        setPlayerView(currentView)
    }, [currentView])

    return (
        <BoardContext.Provider
            value={{
                position,
                playerView,
                movePiece,
                isAllowedToMove,
                onPieceSelected,
                moveOptions
            }}>
            {children}
        </BoardContext.Provider >
    )
}

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) throw new Error("useBoard must be used within a BoardContextProvider")
    return context
}
