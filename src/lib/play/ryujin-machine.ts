import { assign, createMachine } from "xstate";
import { BlackOrWhite, PieceType, Position, SquareType } from "./types";
import { DEFAULT_POSITION } from "./consts";
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
    reserveCards?: CardType[],
    selectedCard?: CardType
    selectedPiece?: { piece: PieceType, square: SquareType },
    moveOptions?: SquareType[]
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
        reserveCards: CardType[]
    }
    | { type: "SELECT_CARD", card: CardType }
    | { type: "SELECT_PIECE", piece: PieceType, square: SquareType }
    | { type: "MOVE", from: SquareType, to: SquareType }
    | { type: "OPPONENT_MOVED", from: SquareType, to: SquareType }
    | { type: "MOVE_CONFIRMED" }

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
        reserveCards: undefined,
        selectedCard: undefined,
        selectedPiece: undefined,
        moveOptions: []
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
                            if (ctx.selfCards?.find(c => c.name === e.card.name)) return e.card
                            return ctx.selectedCard
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
                            const { selectedCard, selfColor } = ctx
                            if (!selectedCard) return;
                            const COLUMNS = "abcde".split("")
                            const options = [] as SquareType[]
                            for (let i = 0; i < selectedCard.delta.length; i++) {
                                const delta = selectedCard.delta[i]
                                const currentCol = COLUMNS.findIndex(col => col === e.square[0])
                                const currentRow = parseInt(e.square[1])
                                const destCol = COLUMNS[currentCol + (selfColor === "w" ? delta.x : delta.x * -1)]
                                const destRow = currentRow + (selfColor === "w" ? delta.y * -1 : delta.y);
                                const outOfBound = !destCol || !destRow || destRow < 1 || destRow > 5
                                if (outOfBound) continue
                                const dest = destCol + destRow as SquareType
                                const piece = ctx.boardPosition[dest]
                                const friendlyFire = !!piece && piece[0] === selfColor
                                if (friendlyFire) continue
                                options.push(dest)
                            }
                            return options
                        }
                    })
                },
                MOVE: {
                    actions: assign({
                        boardPosition: (ctx, e) => {
                            const { to, from } = e
                            if (from === to) ctx.boardPosition
                            const next = { ...ctx.boardPosition }
                            next[to] = next[from]
                            delete next[from]
                            return next
                        }
                    }),
                    target: "proposed_move"
                }
            },
        },
        proposed_move: {
            on: {
                MOVE_CONFIRMED: []
            }
        },
        game_over: {}
    }
})

