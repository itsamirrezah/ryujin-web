import { createContext, ReactNode, useContext, useState } from "react";
import { DEFAULT_POSITION } from "./consts";
import { PlayerView, Position } from "./types";

type BoardContextProviderProps = {
    children: ReactNode
}
type BoardValues = {
    position: Position,
    playerView: PlayerView
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({ children }: BoardContextProviderProps) {
    const [position, setPosition] = useState<Position>(DEFAULT_POSITION)
    const [playerView, setPlayerView] = useState<PlayerView>("w")

    return (
        <BoardContext.Provider value={{ position, playerView }}>
            {children}
        </BoardContext.Provider >
    )
}

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) throw new Error("useBoard must be used within a BoardContextProvider")
    return context
}
