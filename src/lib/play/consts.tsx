import { ActionFunction, assign } from "xstate";
import {
    BlackOrWhite,
    CardType,
    Delta,
    GameContext,
    GameOverEvent,
    MoveEvent,
    OpponentMoveEvent,
    Position,
    SelectCardEvent,
    SelectPieceEvent,
    SquareType,
    TickEvent,
    UpdateTimeEvent
} from "./types";

export const DEFAULT_POSITION: Position = {
    a1: "wP", b1: "wP", c1: "wK", d1: "wP", e1: "wP",
    a5: "bP", b5: "bP", c5: "bK", d5: "bP", e5: "bP"
}

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

export const selectCard = assign({
    selectedCard: (ctx, e) => {
        if (ctx.selfCards?.find(c => c.name === e.card.name)) return e.card
        return ctx.selectedCard
    },
    moveOptions: (ctx, e) => {
        const { selectedPiece, selfColor, boardPosition } = ctx
        const { card: selectedCard } = e
        if (!selectedPiece || !selfColor) return []
        return getCardOptions(selectedPiece.square, selectedCard.delta, selfColor, boardPosition)
    }
}) as ActionFunction<GameContext, SelectCardEvent>

export const selectPiece = assign({
    selectedPiece: (ctx, e) => {
        if (e.piece[0] !== ctx.selfColor) return
        const { piece, square } = e;
        return { piece, square }
    },
    moveOptions: (ctx, e) => {
        const { selectedCard, selfColor, boardPosition } = ctx
        const { square } = e
        if (!selectedCard || !selfColor) return [];
        return getCardOptions(square, selectedCard.delta, selfColor, boardPosition)
    }
}) as ActionFunction<GameContext, SelectPieceEvent>

export const move = assign((ctx, e) => {
    const { from, to } = e
    const { selfCards, reserveCards, selectedCard, boardPosition } = ctx
    if (!selfCards || !reserveCards || !selectedCard || from === to) return ctx

    const [updatedSelfCards, updatedReserveCards] = swapWithDeck(selectedCard, reserveCards, selfCards)

    return {
        boardPosition: updateBoard(boardPosition, from, to),
        hasTurn: false,
        reserveCards: updatedReserveCards,
        selfCards: updatedSelfCards,
        moveOptions: [],
        selectedCard: undefined,
        selectedPiece: undefined,
    }
}) as ActionFunction<GameContext, MoveEvent>

export const tick = assign((ctx, e) => {
    const { hasTurn, selfRemainingTime, opponentRemainingTime, lastTracked } = ctx
    const { interval } = e
    const now = new Date().getTime()
    const diff = !lastTracked ? interval : now - lastTracked
    return {
        selfRemainingTime: hasTurn && selfRemainingTime > 0 ? selfRemainingTime - diff : selfRemainingTime,
        opponentRemainingTime: !hasTurn && opponentRemainingTime > 0 ? opponentRemainingTime - diff : opponentRemainingTime,
        lastTracked: now
    }
}) as ActionFunction<GameContext, TickEvent>

export const opponentMove = assign((ctx, e) => {
    const { from, to, selectedCard, } = e
    const { opponentCards, reserveCards, boardPosition } = ctx
    if (!opponentCards || !reserveCards || !selectedCard || from === to) return ctx

    const [updatedOpponentCards, updatedReserveCards] = swapWithDeck(selectedCard, reserveCards, opponentCards)
    return {
        boardPosition: updateBoard(boardPosition, from, to),
        hasTurn: true,
        reserveCards: updatedReserveCards,
        opponentCards: updatedOpponentCards,
    }
}) as ActionFunction<GameContext, OpponentMoveEvent>

export const updateTime = assign((ctx, e) => {
    const { selfColor } = ctx;
    return {
        selfRemainingTime: selfColor === "w" ? e.white : e.black,
        opponentRemainingTime: selfColor === "w" ? e.black : e.white
    }
}) as ActionFunction<GameContext, UpdateTimeEvent>

export const gameOver = assign((_, e) => {
    const {
        boardPosition,
        endGame,
        selfColor,
        selfCards,
        reserveCards,
        opponentCards,
        whiteRemainingTime,
        blackRemainingTime
    } = e
    return {
        boardPosition,
        selfColor,
        selfCards,
        reserveCards,
        opponentCards,
        endGame,
        selfRemainingTime: selfColor === "w" ? whiteRemainingTime : blackRemainingTime,
        opponentRemainingTime: selfColor === "w" ? blackRemainingTime : whiteRemainingTime
    }
}) as ActionFunction<GameContext, GameOverEvent>
