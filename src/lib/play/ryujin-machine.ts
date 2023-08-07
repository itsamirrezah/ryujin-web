import { assign, createMachine } from "xstate";
import { DEFAULT_POSITION, gameOver, getCardOptions, move, moveConfirmed, opponentMove, selectCard, selectPiece, tick, updateTime } from "./consts";
import { Events, GameContext, PieceType, SquareType, State } from "./types";

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
        selfRemainingTime: 0,
        opponentRemainingTime: 0,
        selfTemple: undefined,
        opponentTemple: undefined,
        selectedCard: undefined,
        selectedPiece: undefined,
        moveOptions: [],
        lastTracked: 0,
        endGame: undefined,
        hasFlagInProgress: false
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
            initial: "hasSelfMoves",
            id: "idle",
            states: {
                hasSelfMoves: {
                    always: [{
                        cond: (ctx) => {
                            const { hasTurn, selfCards, boardPosition, selfColor } = ctx
                            if (!hasTurn || !selfCards || !selfCards || !selfColor) return false
                            const sourceSquares = Object.entries(boardPosition)
                            for (let i = 0; i < sourceSquares.length; i++) {
                                const [square, piece] = sourceSquares[i] as [SquareType, PieceType]
                                if (piece[0] !== selfColor) continue
                                for (let j = 0; j < selfCards.length; j++) {
                                    const card = selfCards[j]
                                    const options = getCardOptions(square, card.delta, selfColor, boardPosition)
                                    if (options.length > 0) return false
                                }
                            }
                            return true
                        },
                        target: "no_moves",
                    },
                    { target: "normal" }
                    ],
                    on: {
                        MOVE: undefined,
                        SELECT_PIECE: undefined,
                        SELECT_CARD: undefined
                    },
                },
                normal: {
                    on: {
                        MOVE: { actions: move, target: "proposed_move" },
                        OPPONENT_MOVED: { actions: opponentMove, target: "hasSelfMoves" },
                        OPPONENT_PASS: { actions: assign(() => ({ hasTurn: true })), target: "hasSelfMoves" }
                    }
                },
                proposed_move: {
                    on: {
                        MOVE_CONFIRMED: { actions: moveConfirmed, target: 'normal' },
                        INVALID_MOVE: {
                            actions: assign((_, e) => e),
                            target: 'hasSelfMoves'
                        },
                        TICK: undefined,
                        SELECT_CARD: undefined,
                        SELECT_PIECE: undefined
                    }
                },
                no_moves: {
                    on: {
                        PASS: {
                            actions: assign((ctx, e) => ({ hasTurn: false })),
                            target: "normal"
                        },
                        MOVE: undefined,
                        SELECT_PIECE: undefined,
                        SELECT_CARD: undefined,
                    }
                }
            },
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
                SELECT_CARD: { actions: selectCard },
                SELECT_PIECE: { actions: selectPiece },
                TICK: { actions: tick },
                UPDATE_TIME: { actions: updateTime },
                GAME_OVER: { actions: gameOver, target: "game_over" },
                FLAG_REQUEST: {
                    actions: assign({ hasFlagInProgress: true })
                },
                REJECT_FLAG: {
                    actions: assign({ hasFlagInProgress: false }),
                }
            },
        },
        game_over: {}
    }
})

