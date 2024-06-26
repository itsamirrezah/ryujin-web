import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BoardContextProvider } from "./board-context"
import Sqaures from "./squares"
import { BoardProps } from "./board-context"
import { useEffect, useRef, useState } from "react"
import DragLayer from "./drag-layer"
import { TouchBackend } from "react-dnd-touch-backend"

export default function Board(props: Omit<BoardProps, "children" | "boardWidth" | "animationDuration">) {
    const [boardWidth, setBoardWith] = useState<number>(0)
    const [isTouchSupport, setIsTouchSupport] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsTouchSupport("ontouchstart" in window || !!window.navigator.maxTouchPoints);
    }, [])

    useEffect(() => {
        if (!ref.current) return;
        let timer: NodeJS.Timeout
        const resizeObserver = new ResizeObserver(() => {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => ref.current && setBoardWith(ref.current.offsetWidth), 200)
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
                <DndProvider backend={isTouchSupport ? TouchBackend : HTML5Backend}>
                    <Sqaures />
                    <DragLayer />
                </DndProvider>
            </BoardContextProvider>
        </div>
    )
}
