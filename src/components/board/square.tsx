import { SquareType } from "@/lib/play/types"
import { Dispatch, ReactNode, useEffect, useRef } from "react"
import { useDrop } from "react-dnd"
import HitOption from "../icons/hit-option"
import MoveOption from "../icons/move-option"
import { useBoard } from "./board-context"
import { DND_ITEM_TYPE } from "./consts"
import styles from "./square.module.css"

export type DndItem = { from: SquareType };

type SquareProps = {
    square: SquareType,
    color: "black" | "white",
    hasPiece: boolean,
    hasOption: boolean,
    children: ReactNode,
}

export default function Square({ square, hasPiece, hasOption, color, children }: SquareProps) {
    const {
        onPieceDrop,
        moveOptions,
        selectedSquare,
        setSelectedSquare,
        currentView,
        boardWidth,
        setCoordinate
    } = useBoard()
    const squareRef = useRef<HTMLDivElement>(null)

    function onSquareSelectHandler(square: SquareType) {
        if (!moveOptions?.includes(square) || !hasOption) return
        setSelectedSquare(undefined)
        onPieceDrop(square)
    }

    const [{ canDrop, isOver }, ref] = useDrop(() => ({
        accept: DND_ITEM_TYPE,
        drop: (item: DndItem) => {
            onSquareSelectHandler(square)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [square, onPieceDrop])


    useEffect(() => {
        if (!squareRef.current || !boardWidth) return
        const { left, right, top, bottom } = squareRef.current.getBoundingClientRect()
        const x = (left + right) / 2;
        const y = (top + bottom) / 2;
        setCoordinate(square, { x, y })
    }, [currentView, boardWidth])

    const hasWhiteTemple = square === "c1"
    const hasBlackTemple = square === "c5"
    const templeStyle = hasWhiteTemple ? styles['temple-w'] : styles['temple-b']
    const squareStyle = `${styles.sqaure} ${styles[`bg-${color}`]}`

    return (
        <div ref={ref} onClick={() => onSquareSelectHandler(square)} className={squareStyle} >
            <div ref={squareRef}>
                {hasOption && (
                    <span className={`${styles.option} ${hasPiece ? styles.hit : ""}`}>
                        {hasPiece ? <HitOption /> : <MoveOption />}
                    </span>
                )}
                {(hasWhiteTemple || hasBlackTemple) && <span className={`${styles.temple} ${templeStyle}`}></span>}
                {selectedSquare && selectedSquare === square && <span className={styles.selected}></span>}
                {children}
            </div>
        </div>
    )
}
