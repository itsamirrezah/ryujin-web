import { assign, AssignAction } from "xstate"
import { getCardOptions, updateBoard, updatePlayerCards } from "../play/consts"
import {
    GameContext,
    GameStartedEvent,
    SelectCardEvent,
    SelectPieceEvent,
    MoveEvent,
    MoveConfirmedEvent,
    MoveRejectedEvent,
    TickEvent,
    OpponentMoveEvent,
    UpdateTimeEvent,
    GameOverEvent,
    LeaveRoomEvent,
    NavigateBackEvent,
    NavigateForwardEvent
} from "./types"

export const startGame = assign((_, e) => {
    return {
        gameId: e.id,
        boardPosition: e.boardPosition,
        selfColor: e.selfColor,
        hasTurn: e.hasTurn,
        selfCards: e.selfCards,
        opponentCards: e.opponentCard,
        selfRemainingTime: e.time,
        opponentRemainingTime: e.time,
        selfTemple: e.selfColor === "w" ? "c1" : "c5",
        opponentTemple: e.selfColor === "w" ? "c5" : "c1",
        lastTracked: new Date().getTime(),
        history: [{ selfCards: e.selfCards, opponentCards: e.opponentCard, boardPosition: e.boardPosition }],
        currentHistory: 0
    }
}) as AssignAction<GameContext, GameStartedEvent>

export const selectCard = assign((ctx, e) => {
    const { card } = e
    const {
        history,
        currentHistory,
        selfCards,
        selectedPiece,
        selfColor,
        boardPosition,
    } = ctx
    if (currentHistory < history.length - 1 || !selfColor) return ctx
    else if (!selfCards?.find(c => c.name === card.name)) return ctx
    return {
        selectedCard: card,
        moveOptions: !selectedPiece ? [] : getCardOptions(selectedPiece.square, card.delta, selfColor, boardPosition)
    }
}) as AssignAction<GameContext, SelectCardEvent>

export const selectPiece = assign((ctx, e) => {
    const { piece, square } = e
    const {
        history,
        currentHistory,
        selfColor,
        selectedCard,
        boardPosition
    } = ctx

    if (currentHistory < history.length - 1 || piece[0] !== selfColor) return ctx

    return {
        selectedPiece: { piece, square },
        moveOptions: !selectedCard ? [] : getCardOptions(square, selectedCard.delta, selfColor, boardPosition)
    }

}) as AssignAction<GameContext, SelectPieceEvent>

export const move = assign((ctx, e) => {
    const { from, to, selectedCard } = e
    const {
        boardPosition,
        history,
        selfCards,
        opponentCards,
    } = ctx
    if (!selfCards || !opponentCards || !selectedCard) return ctx

    const updatedBoard = updateBoard(boardPosition, from, to)
    const updatedHistory = history.slice()
    updatedHistory[updatedHistory.length - 1].selectedCard = selectedCard
    updatedHistory.push({ selfCards, opponentCards, boardPosition: updatedBoard })

    return {
        boardPosition: updatedBoard,
        hasTurn: false,
        selectedPiece: undefined,
        moveOptions: [],
        history: updatedHistory,
        currentHistory: updatedHistory.length - 1
    }
}) as AssignAction<GameContext, MoveEvent>

export const moveConfirmed = assign((ctx, e) => {
    const { replacedCard } = e

    const {
        history,
        opponentCards,
    } = ctx
    if (!opponentCards) return ctx
    const updatedHistory = history.slice()
    const { selfCards, selectedCard } = updatedHistory[updatedHistory.length - 2]

    if (!selectedCard) return ctx

    const updatedSelfCards = updatePlayerCards(selectedCard, replacedCard, selfCards)
    updatedHistory[updatedHistory.length - 1].selfCards = updatedSelfCards

    return {
        selfCards: updatedSelfCards,
        selectedCard: undefined,
        history: updatedHistory,
    }

}) as AssignAction<GameContext, MoveConfirmedEvent>

export const moveRejected = assign((ctx, e) => {
    const {
        selfCards,
        boardPosition,
        opponentCards,
        hasTurn,
        selfColor
    } = e
    const { history } = ctx
    const updatedHistory = history.slice()
    updatedHistory.pop()
    updatedHistory[updatedHistory.length - 1] = { boardPosition, opponentCards, selfCards, selectedCard: undefined }

    return {
        selfCards,
        boardPosition,
        opponentCards,
        hasTurn,
        selfColor,
        history: updatedHistory,
        currentHistory: updatedHistory.length - 1
    }
}) as AssignAction<GameContext, MoveRejectedEvent>

export const tick = assign((ctx, e) => {
    const { hasTurn, selfRemainingTime, opponentRemainingTime, lastTracked } = ctx
    const { interval } = e
    const now = new Date().getTime()
    const diff = !lastTracked ? interval : now - lastTracked
    const updatedSelfRemainingTime = hasTurn && selfRemainingTime > 0 ? selfRemainingTime - diff : selfRemainingTime
    const updatedOpponentRemainingTime = !hasTurn && opponentRemainingTime > 0 ? opponentRemainingTime - diff : opponentRemainingTime
    return {
        selfRemainingTime: updatedSelfRemainingTime,
        opponentRemainingTime: updatedOpponentRemainingTime,
        lastTracked: now,
    }
}) as AssignAction<GameContext, TickEvent>

export const opponentMove = assign((ctx, e) => {
    const { from, to, selectedCard, replacedCard } = e
    const { history } = ctx
    const { selfCards, opponentCards, boardPosition } = history[history.length - 1]
    if (!opponentCards || !selectedCard || !selfCards || from === to) return ctx

    const updatedOpponentCards = updatePlayerCards(selectedCard, replacedCard, opponentCards)
    const updatedBoard = updateBoard(boardPosition, from, to)
    const updatedHistory = history.slice()
    updatedHistory[updatedHistory.length - 1].selectedCard = selectedCard
    updatedHistory.push({ selfCards, opponentCards: updatedOpponentCards, boardPosition: updatedBoard })
    return {
        boardPosition: updatedBoard,
        hasTurn: true,
        opponentCards: updatedOpponentCards,
        history: updatedHistory,
        currentHistory: updatedHistory.length - 1,
        selfCards
    }
}) as AssignAction<GameContext, OpponentMoveEvent>

export const updateTime = assign((ctx, e) => {
    const { selfColor } = ctx;
    const updatedSelfTime = selfColor === "w" ? e.white : e.black
    const updatedOpponentTime = selfColor === "w" ? e.black : e.white

    return {
        selfRemainingTime: updatedSelfTime,
        opponentRemainingTime: updatedOpponentTime,
        //FIXME: get lastTracked from server
        lastTracked: new Date().getTime(),
    }
}) as AssignAction<GameContext, UpdateTimeEvent>

export const gameOver = assign((ctx, e) => {
    const {
        boardPosition,
        endGame,
        selfColor,
        selfCards,
        opponentCards,
        selfRemainingTime,
        opponentRemainingTime
    } = e

    return {
        boardPosition: boardPosition || ctx.boardPosition,
        selfColor: selfColor || ctx.selfColor,
        selfCards: selfCards || ctx.selfCards,
        opponentCards: opponentCards || ctx.opponentCards,
        endGame,
        selfRemainingTime: selfRemainingTime || ctx.selfRemainingTime,
        opponentRemainingTime: opponentRemainingTime || ctx.opponentRemainingTime,
        hasFlagInProgress: false,
        selectedCard: undefined,
        selectedPiece: undefined,
        moveOptions: [],
    }
}) as AssignAction<GameContext, GameOverEvent>

export const leaveRoom = assign(() => {
    return {
        playersInfo: undefined,
        roomId: undefined
    }
}) as AssignAction<GameContext, LeaveRoomEvent>

export const navigateBack = assign((ctx, _) => {
    const { currentHistory, history } = ctx
    const updatedCurrentHistory = currentHistory - 1
    if (updatedCurrentHistory < 0) return ctx
    const currHistory = history[updatedCurrentHistory]
    return {
        selfCards: currHistory.selfCards,
        opponentCards: currHistory.opponentCards,
        boardPosition: currHistory.boardPosition,
        currentHistory: updatedCurrentHistory,
        moveOptions: [],
        selectedCard: currHistory.selectedCard,
        selectedPiece: undefined
    }
}) as AssignAction<GameContext, NavigateBackEvent>

export const navigateForward = assign((ctx, _) => {
    const { currentHistory, history } = ctx
    const updatedCurrentHistory = currentHistory + 1
    if (updatedCurrentHistory >= history.length) return ctx
    const currHistory = history[updatedCurrentHistory]
    return {
        selfCards: currHistory.selfCards,
        opponentCards: currHistory.opponentCards,
        boardPosition: currHistory.boardPosition,
        currentHistory: updatedCurrentHistory,
        moveOptions: [],
        selectedCard: currHistory.selectedCard,
        selectedPiece: undefined
    }
}) as AssignAction<GameContext, NavigateForwardEvent>
