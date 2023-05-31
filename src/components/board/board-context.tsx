import { createContext, ReactNode } from "react";

type BoardContextProviderProps = {
    children: ReactNode
}
type Board = {}

const BoardContext = createContext<Board>({} as Board)

export function BoardContextProvider({ children }: BoardContextProviderProps) {
    return (
        <BoardContext.Provider value={{}}>
            {children}
        </BoardContext.Provider >
    )
}
