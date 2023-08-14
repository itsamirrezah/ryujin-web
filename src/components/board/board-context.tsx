import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { DEFAULT_POSITION } from "@/lib/play/consts";
import { PieceType, BlackOrWhite, Position, SquareType } from "@/lib/play/types";

type Move = {
    from: SquareType,
    to: SquareType
}

export type BoardProps = {
    currentPosition?: Position
    currentView?: BlackOrWhite,
    isPieceDraggable?: (piece: PieceType) => boolean
    onPieceDrag?: (piece: PieceType, square: SquareType) => void
    onPieceDrop?: (square: SquareType) => void
    moveOptions?: SquareType[]
    children: ReactNode
}

type RequiredBoardProps = Required<BoardProps>

type BoardValues = {
    currentPosition: RequiredBoardProps["currentPosition"],
    currentView: RequiredBoardProps["currentView"]
    isPieceDraggable: RequiredBoardProps["isPieceDraggable"]
    onPieceDrag: RequiredBoardProps["onPieceDrag"]
    onPieceDrop: RequiredBoardProps["onPieceDrop"]
    moveOptions: RequiredBoardProps["moveOptions"]
    selectedSquare?: SquareType,
    nextMove?: Move,
    isWaitForAnimation: boolean,
    setSelectedSquare: (square?: SquareType) => void
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({
    children,
    currentPosition = DEFAULT_POSITION,
    currentView = "w",
    isPieceDraggable = () => true,
    onPieceDrag = () => { },
    onPieceDrop = () => { },
    moveOptions = [],
}: BoardProps) {
    const [playerView, setPlayerView] = useState<BlackOrWhite>(currentView)
    const [selectedSquare, setSelectedSquare] = useState<SquareType>()
    const [position, setPosition] = useState<Position>(currentPosition)
    const [nextMove, setNextMove] = useState<Move>()
    const [isWaitForAnimation, setIsWaitForAnimation] = useState(false)

    function setSelectedSquareHandler(square?: SquareType) {
        setSelectedSquare(prev => prev === square ? prev : square)
    }

    function getDiffPosition(current: Position, next: Position) {
        const currentSquares = Object.keys(current)
        let from = "" as SquareType
        let to = "" as SquareType
        for (let i = 0; i < currentSquares.length; i++) {
            const square = currentSquares[i] as SquareType
            if (current[square] === next[square]) continue;
            from = square
            break;
        }
        const nextSquares = Object.keys(next)
        for (let i = 0; i < nextSquares.length; i++) {
            const square = nextSquares[i] as SquareType
            if (next[square] === current[square]) continue;
            to = square
            break;
        }
        if (!from || !to) return null
        return { from, to }
    }

    useEffect(() => {
        setPlayerView(currentView)
    }, [currentView])

    useEffect(() => {
        if (!currentPosition) return;
        if (isWaitForAnimation) {
            setPosition(currentPosition)
            setIsWaitForAnimation(false)
            return;
        }
        const nextMove = getDiffPosition(position, currentPosition)
        if (!nextMove) {
            setPosition(currentPosition)
            setIsWaitForAnimation(false)
            return;
        }
        setNextMove(nextMove)
        setIsWaitForAnimation(true)
        const timeout = setTimeout(() => {
            setPosition(currentPosition)
            setIsWaitForAnimation(false)
        }, 1000)

        return () => clearTimeout(timeout)

    }, [currentPosition])

    return (
        <BoardContext.Provider
            value={{
                currentPosition: position,
                currentView: playerView,
                nextMove,
                isWaitForAnimation,
                isPieceDraggable,
                onPieceDrag,
                onPieceDrop,
                moveOptions,
                setSelectedSquare: setSelectedSquareHandler,
                selectedSquare
            }}>
            {children}
        </BoardContext.Provider>
    )
}

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) throw new Error("useBoard must be used within a BoardContextProvider")
    return context
}
