import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
import { BoardProps } from "./board-context"
import { useEffect, useRef, useState } from "react"

export default function Board(props: Omit<BoardProps, "children" | "boardWidth" | "animationDuration">) {
    const [boardWidth, setBoardWith] = useState<number>()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current) return;
        let timer: NodeJS.Timeout
        const resizeObserver = new ResizeObserver(() => {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => setBoardWith(ref.current?.offsetWidth), 200)
        });
        resizeObserver.observe(ref.current)
        return () => {
            resizeObserver.disconnect();
            clearTimeout(timer)
        }
    }, [])

    return (
        <div ref={ref}>
            <BoardContextProvider
                boardWidth={boardWidth}
                animationDuration={300}
                {...props}>
                <DndProvider backend={HTML5Backend}>
                    <Sqaures />
                </DndProvider>
            </BoardContextProvider>
        </div>
    )
}
