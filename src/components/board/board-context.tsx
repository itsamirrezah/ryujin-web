import { createContext, ReactNode, useContext, useState } from "react";
import { DEFAULT_POSITION } from "./consts";
import { PlayerView, Position, SquareType } from "./types";

type BoardContextProviderProps = {
    children: ReactNode
}
type BoardValues = {
    position: Position,
    playerView: PlayerView
    onMove: (from: SquareType, to: SquareType) => void
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({ children }: BoardContextProviderProps) {
    const [position, setPosition] = useState<Position>(DEFAULT_POSITION)
    const [playerView, setPlayerView] = useState<PlayerView>("w")

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
