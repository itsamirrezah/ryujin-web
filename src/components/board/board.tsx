import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
export default function Board() {
    return (
        <BoardContextProvider>
            <Sqaures />
        </BoardContextProvider>
    )
}
