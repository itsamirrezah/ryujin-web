import { assign, createMachine } from "xstate";
import { PieceType, Position, SquareType } from "@/components/board/types";
import { DEFAULT_POSITION } from "@/components/board/consts";
import { Player } from "./types";
import { Card } from "./consts";

type Context = {
    gameStarted: boolean,
    boardPosition: Position | undefined,
    roomId: string | undefined,
    playersInfo: Record<"self" | "opponent", Player> | undefined
    selfColor: "w" | "b" | undefined
    hasTurn: boolean,
    selfCards: [Card, Card] | undefined,
    opponentCards: [Card, Card] | undefined,
    reserveCards: Card[] | undefined,
    selectedCard: Card | undefined,
    selectedPiece: SquareType | undefined
}

type Events =
    | { type: "PLAYER_JOIN", players: Record<"self" | "opponent", Player>, roomId: string }
    | { type: "GAME_STARTED", boardPosition: Position, selfColor: "w" | "b", hasTurn: boolean, selfCards: [Card, Card], opponentCard: [Card, Card], reserveCards: Card[] }
    | { type: "SELECT_CARD", selectedCard: Card }
    | { type: "SELECT_PIECE", selectedPiece: SquareType }

type StateOptions = "pregame" | "idle" | "proposed_action" | "moved" | "game_over"

type State = { value: StateOptions, context: Context }

export const ryujinMachine = createMachine<Context, Events, State>({
    context: {
        gameStarted: false,
        boardPosition: undefined,
        roomId: undefined,
        playersInfo: undefined,
        selfColor: undefined,
        hasTurn: false,
        selfCards: undefined,
        opponentCards: undefined,
        reserveCards: undefined,
        selectedCard: undefined,
        selectedPiece: undefined
    },
    initial: "pregame",
    states: {
        pregame: {
            entry: assign({ boardPosition: DEFAULT_POSITION }),
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
            on: {
                SELECT_CARD: {
                    actions: assign({
                        selectedCard: (ctx, e) => {
                            if (ctx.selfCards?.find(c => c.name === e.selectedCard.name)) return e.selectedCard
                            return ctx.selectedCard
                        }
                    })
                },
                SELECT_PIECE: {
                    actions: assign({
                        selectedPiece: (ctx, e) => {
                            return e.selectedPiece
                        }
                    })
                }
            },
        },
        proposed_action: {
            on: {
                // MOVE: { actions: assign({ boardPosition: (ctx, e) => undefined }) }
            }
        },
        moved: {
            after: {
                200: 'proposed_action'
            }
        },
        game_over: {}
    }
})

