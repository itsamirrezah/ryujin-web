import { assign, createMachine } from "xstate";
import { BlackOrWhite, PieceType, Position, SquareType } from "./types";
import { DEFAULT_POSITION, getCardOptions, swapWithDeck, updateBoard } from "./consts";
import { PlayerResponse } from "./types";
import { CardType } from "./types";

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

type Events =
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

type State = { value: StateOptions, context: GameContext }

export const ryujinMachine = createMachine<GameContext, Events, State>({
    context: {
        gameStarted: false,
        boardPosition: DEFAULT_POSITION,
        roomId: undefined,
        playersInfo: undefined,
        selfColor: undefined,
        hasTurn: false,
        selfCards: undefined,
        opponentCards: undefined,
        reserveCards: [],
        selfRemainingTime: 0,
        opponentRemainingTime: 0,
        selfTemple: undefined,
        opponentTemple: undefined,
        selectedCard: undefined,
        selectedPiece: undefined,
        moveOptions: [],
        lastTracked: 0
    },
    initial: "pregame",
    states: {
        pregame: {
            on: {
                PLAYER_JOIN: {
                    actions: assign({
                        playersInfo: (_, e) => e.players,
                        roomId: (_, e) => e.roomId
                    })
                },
                GAME_STARTED: {
                    target: "idle",
                    actions: assign({
                        boardPosition: (_, e) => e.boardPosition,
                        selfColor: (_, e) => e.selfColor,
                        hasTurn: (_, e) => e.hasTurn,
                        selfCards: (_, e) => e.selfCards,
                        opponentCards: (_, e) => e.opponentCard,
                        reserveCards: (_, e) => e.reserveCards,
                        selfRemainingTime: (_, e) => e.time,
                        opponentRemainingTime: (_, e) => e.time,
                        selfTemple: (_, e) => e.selfColor === "w" ? "c1" : "c5",
                        opponentTemple: (_, e) => e.selfColor === "w" ? "c5" : "c1",
                        gameStarted: true
                    })
                }
            }
        },
        idle: {
            always: [
                {
                    target: "game_over",
                    cond: () => false
                },
            ],
            invoke: {
                id: 'invoke-tick',
                src: () => (sendBack) => {
                    const interval = 100;
                    const i = setInterval(() => {
                        sendBack({ type: "TICK", interval })
                    }, interval)
                    return () => clearInterval(i)
                }
            },
            on: {
                SELECT_CARD: {
                    actions: assign({
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
                    })
                },
                SELECT_PIECE: {
                    actions: assign({
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
                    })
                },
                MOVE: {
                    actions: assign((ctx, e) => {
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
                    }),
                    target: "proposed_move"
                },
                OPPONENT_MOVED: {
                    actions: assign((ctx, e) => {
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
                    })
                },
                TICK: {
                    actions: assign((ctx, e) => {
                        const { hasTurn, selfRemainingTime, opponentRemainingTime, lastTracked } = ctx
                        const { interval } = e
                        const now = new Date().getTime()
                        const diff = !lastTracked ? interval : now - lastTracked
                        return {
                            selfRemainingTime: hasTurn ? selfRemainingTime - diff : selfRemainingTime,
                            opponentRemainingTime: hasTurn ? opponentRemainingTime : opponentRemainingTime - diff,
                            lastTracked: now
                        }
                    })
                },
                UPDATE_TIME: {
                    actions: assign((ctx, e) => {
                        const { selfColor } = ctx;
                        return {
                            selfRemainingTime: selfColor === "w" ? e.white : e.black,
                            opponentRemainingTime: selfColor === "w" ? e.black : e.white
                        }
                    })
                }
            },
        },
        proposed_move: {
            on: {
                MOVE_CONFIRMED: 'idle',
                INVALID_MOVE: {
                    actions: assign((_, e) => {
                        const { boardPosition, selfColor, hasTurn, selfCards, opponentCards, reserveCards, } = e
                        return { boardPosition, selfCards, hasTurn, opponentCards, reserveCards }
                    }),
                    target: 'idle'
                }
            }
        },
        game_over: {}
    }
})

