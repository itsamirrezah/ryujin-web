import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { DEFAULT_POSITION } from "./consts";
import { PlayerView, Position, SquareType } from "./types";

type BoardContextProviderProps = {
    currentPosition?: Position
    children: ReactNode
}
type BoardValues = {
    position: Position,
    playerView: PlayerView
    onMove: (from: SquareType, to: SquareType) => void
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({ children, currentPosition = DEFAULT_POSITION }: BoardContextProviderProps) {
    const [position, setPosition] = useState<Position>(currentPosition)
    const [playerView, setPlayerView] = useState<PlayerView>("w")

    useEffect(() => {
        setPosition(currentPosition)

    }, [currentPosition])

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
        <BoardContext.Provider value={{ position, playerView, onMove }}>
            {children}
        </BoardContext.Provider >
    )
}

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) throw new Error("useBoard must be used within a BoardContextProvider")
    return context
}
