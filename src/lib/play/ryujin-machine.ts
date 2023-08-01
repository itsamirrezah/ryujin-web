import { assign, createMachine } from "xstate";
import { DEFAULT_POSITION, gameOver, move, opponentMove, selectCard, selectPiece, tick, updateTime } from "./consts";
import { Events, GameContext, State } from "./types";


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
        lastTracked: 0,
        endGame: undefined
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
            initial: "normal",
            id: "idle",
            states: {
                normal: {
                    on: {
                        MOVE: {
                            actions: move,
                            target: "proposed_move"
                        },
                        OPPONENT_MOVED: {
                            actions: opponentMove
                        },
                    }
                },
                proposed_move: {
                    on: {
                        MOVE_CONFIRMED: 'normal',
                        INVALID_MOVE: {
                            actions: assign((_, e) => {
                                const { boardPosition, selfColor, hasTurn, selfCards, opponentCards, reserveCards, } = e
                                return { boardPosition, selfColor, selfCards, hasTurn, opponentCards, reserveCards }
                            }),
                            target: 'normal'
                        },
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
                SELECT_CARD: {
                    actions: selectCard
                },
                SELECT_PIECE: {
                    actions: selectPiece
                },
                TICK: {
                    actions: tick
                },
                UPDATE_TIME: {
                    actions: updateTime
                },
                GAME_OVER: {
                    actions: gameOver,
                    target: "game_over"
                }
            },
        },
        game_over: {}
    }
})

