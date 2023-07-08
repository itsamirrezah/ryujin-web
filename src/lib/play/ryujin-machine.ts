import { assign, createMachine } from "xstate";
import { Position } from "@/components/board/types";
import { DEFAULT_POSITION } from "@/components/board/consts";
import { Player } from "./types";

type Context = {
    boardPosition: Position | undefined;
    roomId: string | undefined,
    playersInfo: Record<"self" | "opponent", Player> | undefined
    selfColor: "w" | "b" | undefined
    hasTurn: boolean
}

type Events =
    | { type: "MOVE", payload: string }
    | { type: "PLAYER_JOIN", players: Record<"self" | "opponent", Player>, roomId: string }
    | { type: "GAME_STARTED", boardPosition: Position, selfColor: "w" | "b", hasTurn: boolean }

type StateOptions = "pregame" | "idle" | "proposed_action" | "moved" | "game_over"

type State = { value: StateOptions, context: Context }

export const ryujinMachine = createMachine<Context, Events, State>({
    context: {
        boardPosition: undefined,
        roomId: undefined,
        playersInfo: undefined,
        selfColor: undefined,
        hasTurn: false,
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
                        hasTurn: (_, e) => e.hasTurn
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

