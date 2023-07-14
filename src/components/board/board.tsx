import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
import { BoardProps } from "./board-context"

export default function Board(props: Omit<BoardProps, "children">) {
    return (
        <BoardContextProvider {...props}>
            <DndProvider backend={HTML5Backend}>
                <Sqaures />
            </DndProvider>
        </BoardContextProvider>
    )
}
