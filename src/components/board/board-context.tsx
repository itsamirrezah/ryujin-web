import { createContext, ReactNode, useContext, useState } from "react";
import { DEFAULT_POSITION } from "./consts";
import { Position } from "./types";

type BoardContextProviderProps = {
    children: ReactNode
}
type BoardValues = {
    position: Position
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({ children }: BoardContextProviderProps) {
    const [position, setPosition] = useState<Position>(DEFAULT_POSITION)

    return (
        <BoardContext.Provider value={{ position }}>
            {children}
        </BoardContext.Provider >
    )
}

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) throw new Error("useBoard must be used within a BoardContextProvider")
    return context
}
