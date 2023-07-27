import { StateFrom } from "xstate";
import { ryujinMachine } from "./ryujin-machine";
import { BlackOrWhite, CardType, Delta, PieceType, PlayerResponse, Position, SquareType } from "./types";

export const DEFAULT_POSITION: Position = {
    a1: "wP", b1: "wP", c1: "wK", d1: "wP", e1: "wP",
    a5: "bP", b5: "bP", c5: "bK", d5: "bP", e5: "bP"
}

export type GameContext = {
    gameStarted: boolean,
    boardPosition: Position,
    roomId?: string,
    playersInfo?: Record<"self" | "opponent", PlayerResponse>
    selfColor?: BlackOrWhite
    hasTurn: boolean,
    selfCards?: [CardType, CardType],
    opponentCards?: [CardType, CardType],
    reserveCards: CardType[],
    selfRemainingTime: number,
    opponentRemainingTime: number,
    selfTemple?: SquareType,
    opponentTemple?: SquareType
    selectedCard?: CardType
    selectedPiece?: { piece: PieceType, square: SquareType },
    moveOptions?: SquareType[],
    lastTracked: number
}

export type Events =
    | {
        type: "PLAYER_JOIN",
        players: Record<"self" | "opponent", PlayerResponse>,
        roomId: string
    }
    | {
        type: "GAME_STARTED",
        boardPosition: Position,
        selfColor: BlackOrWhite,
        hasTurn: boolean,
        selfCards: [CardType, CardType],
        opponentCard: [CardType, CardType],
        reserveCards: CardType[],
        time: number
    }
    | { type: "SELECT_CARD", card: CardType }
    | { type: "SELECT_PIECE", piece: PieceType, square: SquareType }
    | { type: "MOVE", from: SquareType, to: SquareType }
    | { type: "OPPONENT_MOVED", playerId: string, from: SquareType, to: SquareType, selectedCard: CardType }
    | { type: "MOVE_CONFIRMED" }
    | { type: "TICK", interval: number }
    | { type: "UPDATE_TIME", white: number, black: number }
    | {
        type: "INVALID_MOVE",
        boardPosition: Position,
        selfColor: BlackOrWhite,
        hasTurn: boolean,
        selfCards: [CardType, CardType],
        opponentCards: [CardType, CardType],
        reserveCards: CardType[]
    }

type StateOptions = "pregame" | "idle" | "proposed_move" | "game_over"

export type State = { value: StateOptions, context: GameContext }

export type RyujinState = StateFrom<typeof ryujinMachine>


export function updateBoard(board: Position, from: SquareType, to: SquareType) {
    const mutableBoard = { ...board }
    mutableBoard[to] = mutableBoard[from]
    delete mutableBoard[from]
    return mutableBoard
}

export function swapWithDeck(
    selectedCard: CardType,
    deckCards: CardType[],
    playerCards: [CardType, CardType]
): [[CardType, CardType], CardType[]] {
    const mutablePlayerCards = [...playerCards] as [CardType, CardType]
    const idx = mutablePlayerCards.findIndex(c => c.name === selectedCard.name)
    if (idx < 0) return [playerCards, deckCards]
    mutablePlayerCards.splice(idx, 1)
    mutablePlayerCards.push(deckCards[0])

    const mutableDeckCards = [...deckCards]
    mutableDeckCards.splice(0, 1)
    mutableDeckCards.push(selectedCard)
    return [mutablePlayerCards, mutableDeckCards]
}
export function getCardOptions(
    sourceSquare: SquareType,
    deltaOptions: Delta[],
    moveAs: BlackOrWhite,
    board: Position
): SquareType[] {
    const COLUMNS = "abcde".split("")
    const options = [] as SquareType[]

    for (let i = 0; i < deltaOptions.length; i++) {
        const delta = deltaOptions[i]
        const currentCol = COLUMNS.findIndex(col => col === sourceSquare[0])
        const currentRow = parseInt(sourceSquare[1])
        const destCol = COLUMNS[currentCol + (moveAs === "w" ? delta.x : delta.x * -1)]
        const destRow = currentRow + (moveAs === "w" ? delta.y * -1 : delta.y);
        const outOfBound = !destCol || !destRow || destRow < 1 || destRow > 5
        if (outOfBound) continue
        const destSquare = destCol + destRow as SquareType
        const piece = board[destSquare]
        const friendlyFire = !!piece && piece[0] === moveAs
        if (friendlyFire) continue
        options.push(destSquare)
    }
    return options
}
