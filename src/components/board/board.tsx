import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
export default function Board() {
    return (
        <BoardContextProvider>
            <DndProvider backend={HTML5Backend}>
                <Sqaures />
            </DndProvider>
        </BoardContextProvider>
    )
}
