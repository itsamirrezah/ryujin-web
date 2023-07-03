import { actions, assign, createMachine } from "xstate";
import { Position } from "@/components/board/types";
import { DEFAULT_POSITION } from "@/components/board/consts";
import { Player } from "./types";


type Context = {
    boardPosition: Position | undefined;
    roomId: string | undefined,
    players: Player[] | undefined
    turn: "w" | "b" | undefined
    whitePlayerId: string | undefined,
    blackPlayerId: string | undefined
}

type Events =
    | { type: "MOVE", payload: string }
    | { type: "PLAYER_JOIN", players: Player[], roomId: string }
    | { type: "GAME_STARTED", boardPosition: Position, turn: "w" | "b", blackPlayerId: string, whitePlayerId: string }

type StateOptions = "pregame" | "idle" | "proposed_action" | "moved" | "game_over"

type State = { value: StateOptions, context: Context }

export const ryujinMachine = createMachine<Context, Events, State>({
    context: {
        boardPosition: undefined,
        roomId: undefined,
        players: undefined,
        turn: undefined,
        whitePlayerId: undefined,
        blackPlayerId: undefined
    },
    initial: "pregame",
    states: {
        pregame: {
            entry: assign({ boardPosition: DEFAULT_POSITION }),
            on: {
                PLAYER_JOIN: {
                    actions: assign({
                        players: (_, e) => e.players,
                        roomId: (_, e) => e.roomId
                    })
                },
                GAME_STARTED: {
                    target: "idle",
                    actions: assign({
                        boardPosition: (_, e) => e.boardPosition,
                        turn: (_, e) => e.turn,
                        blackPlayerId: (_, e) => e.blackPlayerId,
                        whitePlayerId: (_, e) => e.whitePlayerId
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
                { target: "proposed_action" }
            ],
        },
        proposed_action: {
            on: {
                MOVE: { actions: assign({ boardPosition: (ctx, e) => undefined }) }
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

