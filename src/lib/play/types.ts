import { Dispatch, ReactNode, SetStateAction } from "react";
import { InterpreterFrom } from "xstate";
import { ryujinMachine } from "../ryujin/ryujin-machine";

export type PieceType = "wP" | "wK" | "bP" | "bK";

export type SquareType =
    "a5" | "b5" | "c5" | "d5" | "e5" |
    "a4" | "b4" | "c4" | "d4" | "e4" |
    "a3" | "b3" | "c3" | "d3" | "e3" |
    "a2" | "b2" | "c2" | "d2" | "e2" |
    "a1" | "b1" | "c1" | "d1" | "e1"

export type Position = { [key in SquareType]?: PieceType }

export type BlackOrWhite = "w" | "b";

export type GameInfo = {
    time: number,
    numberOfCards: number
}

export type PlayerResponse = {
    socketId: string,
    userId: string,
    username: string
}

export type EndGame = {
    result: "draw",
    by: "insufficent material" | "agreement"
} | ({
    result: "won",
    playerWon: string,
    playerWonColor: "w" | "b"
    by: "conquer temple" | "time" | "resignation" | "slaughter" | "abandon"
})

export type CardType = {
    name: string,
    options: number[],
    delta: Delta[];
}

export type Delta = {
    x: number,
    y: number
}

export type GameContext = {
    onMove: (from: SquareType, to: SquareType, selectedCard: CardType) => void,
    onPassTurn: () => void
    onClaimOpponentTimeout: () => void,
    onResign: () => void,
    onRematch: () => void,
    onCancelJoin: () => void,
    prevOpponent?: PlayerResponse,
    isRoomActionInProgress: boolean,
}

export type PlayWithProps = {
    children: ReactNode,
    setContext: Dispatch<SetStateAction<GameContext | null>>
    setPlayingMode: Dispatch<SetStateAction<0 | 1 | 2>>
} & UsePlayWithProps

export type UsePlayWithProps = {
    ryujinService: InterpreterFrom<typeof ryujinMachine>,
    gameInfo: GameInfo,
}
