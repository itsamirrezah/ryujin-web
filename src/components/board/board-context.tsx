import { DEFAULT_POSITION } from "@/lib/play/consts";
import { BlackOrWhite, PieceType, Position, SquareType } from "@/lib/play/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Coord, Coordinates, Move } from "./types";

export type BoardProps = {
    boardWidth: number,
    animationDuration: number,
    currentPosition?: Position
    currentView?: BlackOrWhite,
    isPieceDraggable?: (piece: PieceType) => boolean
    onPieceDrag?: (piece: PieceType, square: SquareType) => void
    onPieceMoved?: (square: SquareType) => void
    moveOptions?: SquareType[]
    children: ReactNode
}

type RequiredBoardProps = Required<BoardProps>

type BoardValues = {
    currentPosition: RequiredBoardProps["currentPosition"],
    currentView: RequiredBoardProps["currentView"]
    isPieceDraggable: RequiredBoardProps["isPieceDraggable"]
    onPieceDrag: RequiredBoardProps["onPieceDrag"]
    onMoveHandler: (to: SquareType, isDrop?: boolean) => void,
    moveOptions: RequiredBoardProps["moveOptions"],
    boardWidth: number,
    animationDuration: number,
    selectedSquare?: SquareType,
    nextMove?: Move,
    isWaitForAnimation: boolean,
    coordinates?: Coordinates,
    setCoordinate: (square: SquareType, coord: Coord) => void,
    setSelectedSquare: (square?: SquareType) => void
}

const BoardContext = createContext<BoardValues>({} as BoardValues)

export function BoardContextProvider({
    children,
    currentPosition = DEFAULT_POSITION,
    boardWidth,
    animationDuration,
    currentView = "w",
    isPieceDraggable = () => true,
    onPieceDrag = () => { },
    onPieceMoved = () => { },
    moveOptions = [],
}: BoardProps) {
    const [playerView, setPlayerView] = useState<BlackOrWhite>(currentView)
    const [selectedSquare, setSelectedSquare] = useState<SquareType>()
    const [position, setPosition] = useState<Position>(currentPosition)
    const [nextMove, setNextMove] = useState<Move>()
    const [coordinates, setCoordinates] = useState<Coordinates>()
    const [isNextMoveDrop, setIsNextMoveDrop] = useState(false)
    const [isWaitForAnimation, setIsWaitForAnimation] = useState(false)

    function setSelectedSquareHandler(square?: SquareType) {
        setSelectedSquare(prev => prev === square ? prev : square)
    }

    function setCoordinate(square: SquareType, coord: Coord) {
        setCoordinates(prev => ({ ...prev, [square]: coord }))
    }

    function getNextMove(current: Position, next: Position): Move | null {
        let from = "" as SquareType
        let to = "" as SquareType

        const squares = Object.keys(next)
        const currentSquares = Object.keys(current)
        for (let i = 0; i < currentSquares.length; i++) {
            const square = currentSquares[i]
            if (squares.includes(square)) {
                continue
            }
            squares.push(square)
        }

        let reserved = "" as SquareType
        for (let i = 0; i < squares.length; i++) {
            const square = squares[i] as SquareType
            const currPiece = current[square]
            const nextPiece = next[square]
            if (currPiece === nextPiece) {
                continue
            }
            if (!!currPiece && !!nextPiece && currPiece !== nextPiece) {
                reserved = square
                continue
            }
            if (!!currPiece && !nextPiece) {
                from = square
            } else if (!currPiece && !!nextPiece) {
                to = square
            }
        }
        console.log({ reserved, from, to })
        if (!from && !to) {
            return null
        }
        console.log("1")
        if (!!reserved && !from) {
            from = reserved
        } else if (!!reserved && !to) {
            to = reserved
        }
        if (!from && !to) {
            return null
        }
        console.log("2")
        console.log({ reserved, from, to })
        return { from, to }
    }

    function onMoveHandler(to: SquareType, isDrop: boolean = false) {
        setIsNextMoveDrop(isDrop)
        onPieceMoved(to)
    }

    useEffect(() => {
        setPlayerView(currentView)
    }, [currentView])

    useEffect(() => {
        if (!currentPosition) return;
        if (isWaitForAnimation || isNextMoveDrop || playerView !== currentView) {
            setPosition(currentPosition)
            setIsWaitForAnimation(false)
            setIsNextMoveDrop(false)
            return;
        }
        const nextMove = getNextMove(position, currentPosition)
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
        }, animationDuration)

        return () => clearTimeout(timeout)
    }, [currentPosition])

    return (
        <BoardContext.Provider
            value={{
                currentPosition: position,
                currentView: playerView,
                coordinates,
                setCoordinate,
                nextMove,
                isWaitForAnimation,
                isPieceDraggable,
                onPieceDrag,
                boardWidth,
                animationDuration,
                onMoveHandler,
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
