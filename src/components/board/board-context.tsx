import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { DEFAULT_POSITION } from "./consts";
import { PieceType, PlayerView, Position, SquareType } from "./types";

type BoardContextProviderProps = {
    currentPosition?: Position
    children: ReactNode
    isAllowedToMove: (piece: PieceType) => boolean
    currentView?: PlayerView,
    onPieceSelected: (square: SquareType) => void
}
type BoardValues = {
    position: Position,
    playerView: PlayerView
    onMove: (from: SquareType, to: SquareType) => void
    isAllowedToMove: (piece: PieceType) => boolean
    onPieceSelected: (square: SquareType) => void
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({
    children,
    currentPosition = DEFAULT_POSITION,
    currentView = "w",
    isAllowedToMove,
    onPieceSelected
}: BoardContextProviderProps) {
    const [position, setPosition] = useState<Position>(currentPosition)
    const [playerView, setPlayerView] = useState<PlayerView>(currentView)

    useEffect(() => {
        setPosition(currentPosition)
    }, [currentPosition])

    useEffect(() => {
        setPlayerView(currentView)
    }, [currentView])

    function onMove(from: SquareType, to: SquareType) {
        if (from === to) return

        setPosition(prev => {
            const next = { ...prev }
            next[to] = next[from]
            delete next[from]
            return next
        })
    }

    return (
        <BoardContext.Provider
            value={{
                position,
                playerView,
                onMove,
                isAllowedToMove,
                onPieceSelected
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
