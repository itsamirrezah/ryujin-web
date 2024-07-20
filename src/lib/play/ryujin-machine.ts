import { assign, createMachine } from "xstate";
import {
    DEFAULT_POSITION,
    gameOver,
    hasMoves,
    move,
    moveConfirmed,
    moveRejected,
    navigateBack,
    navigateForward,
    opponentMove,
    selectCard,
    selectPiece,
    startGame,
    tick,
    updateTime
} from "./consts";
import { Events, GameContext } from "./types";

export const ryujinMachine = createMachine({
    schema: {
        context: {} as GameContext,
        events: {} as Events,
    },
    context: {
        roomId: undefined,
        gameId: undefined,
        boardPosition: DEFAULT_POSITION,
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
        hasFlagInProgress: false,
        history: [],
        currentHistory: 0
    },
    initial: "lobby",
    on: {
        UPDATE_PLAYERS: {
            actions: assign({
                playersInfo: (_, e) => e.players,
                roomId: (_, e) => e.roomId
            })
        },
    },
    states: {
        lobby: {
            initial: "idle",
            states: {
                idle: {
                    on: {
                        INVITE_FRIEND: {
                            target: "waitingForFriend"
                        },
                        JOIN_FRIEND: {
                            actions: assign({ roomId: (_, e) => e.roomId }),
                            target: "friendInJoinLobby"
                        },
                        PLAY_OFFLINE: {
                            target: "waitingForComputer"
                        }
                    }
                },
                waitingForOpponent: {},
                waitingForFriend: {},
                friendInJoinLobby: {},
                waitingForRematch: {
                    on: {
                        UPDATE_PLAYERS: [{
                            target: "idle",
                            actions: assign({ roomId: undefined }),
                            cond: (_, e) => !e.players?.opponent
                        }]
                    },
                },
                waitingForComputer: {}
            },
            on: {
                QUICK_MATCH: {
                    target: "lobby.waitingForOpponent"
                },
                GAME_STARTED: {
                    target: "playing",
                    actions: startGame
                },
                LEAVE_ROOM: {
                    target: "lobby",
                    actions: assign({ roomId: undefined })
                }
            }
        },
        playing: {
            initial: "isOutOfMoves",
            id: "play",
            states: {
                isOutOfMoves: {
                    always: [{
                        cond: (ctx) => {
                            const { hasTurn, selfCards, boardPosition, selfColor } = ctx
                            if (!hasTurn || !selfCards || !selfCards || !selfColor) return false
                            return !hasMoves(boardPosition, selfCards, selfColor)
                        },
                        target: "noMove",
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
                        MOVE: { actions: move, target: "pendingMove" },
                        OPPONENT_MOVED: { actions: opponentMove, target: "isOutOfMoves" },
                        OPPONENT_PASS: { actions: assign(() => ({ hasTurn: true })), target: "isOutOfMoves" }
                    }
                },
                pendingMove: {
                    on: {
                        MOVE_CONFIRMED: { actions: moveConfirmed, target: 'normal' },
                        MOVE_REJECTED: {
                            actions: moveRejected,
                            target: 'isOutOfMoves'
                        },
                        TICK: undefined,
                        SELECT_CARD: undefined,
                        SELECT_PIECE: undefined
                    }
                },
                noMove: {
                    on: {
                        PASS_TURN: {
                            actions: assign(() => ({ hasTurn: false })),
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
                GAME_OVER: { actions: gameOver, target: "gameOver" },
                CLAIM_OPPONENT_TIMEOUT: {
                    actions: assign({ hasFlagInProgress: true })
                },
                TIMEOUT_REJECTED: {
                    actions: assign({ hasFlagInProgress: false }),
                },
                LEAVE_ROOM: {
                    target: "lobby",
                    actions: assign({ roomId: undefined })
                },
                NAVIGATE_BACK: {
                    actions: navigateBack
                },
                NAVIGATE_FORWARD: {
                    actions: navigateForward
                }
            },
        },
        gameOver: {
            initial: "idle",
            states: {
                idle: {
                    on: {
                        OPPONENT_REMATCH: {
                            target: "opponentRematchRequest"
                        }
                    }
                },
                opponentRematchRequest: {},
            },
            on: {
                GAME_STARTED: {
                    target: "playing",
                    actions: startGame
                },
                REMATCH: {
                    target: "lobby.waitingForRematch"
                },
                QUICK_MATCH: {
                    target: "lobby.waitingForOpponent",
                    actions: assign({ roomId: undefined })
                },
                LEAVE_ROOM: {
                    target: "lobby",
                    actions: assign({ roomId: undefined })
                },
            },
        }
    }
})
