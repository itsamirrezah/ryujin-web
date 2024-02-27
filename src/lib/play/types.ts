import { EventFrom, StateFrom } from "xstate";
import { ryujinMachine } from "./ryujin-machine";

export type PieceType = "wP" | "wK" | "bP" | "bK";
export type SquareType =
    "a5" | "b5" | "c5" | "d5" | "e5" |
    "a4" | "b4" | "c4" | "d4" | "e4" |
    "a3" | "b3" | "c3" | "d3" | "e3" |
    "a2" | "b2" | "c2" | "d2" | "e2" |
    "a1" | "b1" | "c1" | "d1" | "e1"
export type Position = { [key in SquareType]?: PieceType }
export type BlackOrWhite = "w" | "b";
export type RoomResponse = {
    id: string;
    players: PlayerResponse[];
}
export type PlayerResponse = {
    socketId: string,
    userId: string,
    username: string
}

export type EndGame = {
    result: "draw",
    by: "insufficent material" | "agreement"
} | ({
    result: "won",
    playerWon: string,
    playerWonColor: "w" | "b"
    by: "conquer temple" | "time" | "resignation" | "slaughter" | "abandon"
})

export type GameResponse = {
    id: string,
    roomId: string,
    turnColor: BlackOrWhite,
    turnId: string,
    whiteId: string,
    blackId: string,
    boardPosition: Position,
    whiteCards: [CardType, CardType],
    blackCards: [CardType, CardType],
    gameTime: number,
    endGame: EndGame,
    whiteRemainingTime: number,
    blackRemainingTime: number
}

export type MoveResponse = {
    playerId: string,
    from: SquareType,
    to: SquareType
    selectedCard: CardType
}

export type CardType = {
    name: string,
    options: number[],
    delta: Delta[];
}

export type Delta = {
    x: number,
    y: number
}

export type InvalidMoveResponse = {
    message: string,
    payload: GameResponse
}

export type GameContext = {
    boardPosition: Position,
    roomId?: string,
    gameId?: string,
    playersInfo?: Record<"self" | "opponent", PlayerResponse>
    selfColor?: BlackOrWhite
    hasTurn: boolean,
    selfCards?: [CardType, CardType],
    opponentCards?: [CardType, CardType],
    selfRemainingTime: number,
    opponentRemainingTime: number,
    selfTemple?: SquareType,
    opponentTemple?: SquareType
    selectedCard?: CardType
    selectedPiece?: { piece: PieceType, square: SquareType },
    moveOptions?: SquareType[],
    lastTracked: number,
    endGame?: EndGame,
    hasFlagInProgress: boolean
}

export type QuickMatchEvent = {
    type: "QUICK_MATCH"
}

export type InviteFriendEvent = {
    type: "INVITE_FRIEND"
}

export type JoinFriendEvent = {
    type: "JOIN_FRIEND"
    roomId: string
}

export type CancelJoinEvent = {
    type: "CANCEL_JOIN",
}

export type PlayerJoinEvent = {
    type: "PLAYER_JOIN",
    players: Record<"self" | "opponent", PlayerResponse>,
    roomId: string
}


export type GameStartedEvent = {
    type: "GAME_STARTED",
    id: string,
    boardPosition: Position,
    selfColor: BlackOrWhite,
    hasTurn: boolean,
    selfCards: [CardType, CardType],
    opponentCard: [CardType, CardType],
    time: number
}

export type SelectCardEvent = { type: "SELECT_CARD", card: CardType }
export type SelectPieceEvent = { type: "SELECT_PIECE", piece: PieceType, square: SquareType }
export type MoveEvent = { type: "MOVE", from: SquareType, to: SquareType }
export type OpponentMoveEvent = {
    type: "OPPONENT_MOVED",
    from: SquareType,
    to: SquareType,
    selectedCard: CardType,
    replacedCard: CardType,
}
export type MoveConfirmedEvent = { type: "MOVE_CONFIRMED", replacedCard: CardType }
export type TickEvent = { type: "TICK", interval: number }
export type UpdateTimeEvent = { type: "UPDATE_TIME", white: number, black: number }
export type InvalidMoveEvent = {
    type: "INVALID_MOVE",
    boardPosition: Position,
    selfColor: BlackOrWhite,
    hasTurn: boolean,
    selfCards: [CardType, CardType],
    opponentCards: [CardType, CardType],
}
export type GameOverEvent = {
    type: "GAME_OVER"
    boardPosition: Position,
    selfColor: BlackOrWhite,
    selfCards: [CardType, CardType],
    opponentCards: [CardType, CardType],
    endGame: EndGame,
    whiteRemainingTime: number,
    blackRemainingTime: number
}
export type OpponentRematch = {
    type: "OPPONENT_REMATCH"
}
export type FlagRequestEvent = { type: "FLAG_REQUEST" }
export type REJECT_FLAG = { type: "REJECT_FLAG" }
export type PassEvent = { type: "PASS" }
export type OpponentPassEvent = { type: "OPPONENT_PASS" }
export type Events =
    | PlayerJoinEvent | GameStartedEvent | SelectCardEvent | SelectPieceEvent
    | MoveEvent | OpponentMoveEvent | MoveConfirmedEvent | TickEvent
    | UpdateTimeEvent | InvalidMoveEvent | GameOverEvent | FlagRequestEvent
    | REJECT_FLAG | PassEvent | OpponentPassEvent | QuickMatchEvent | InviteFriendEvent
    | JoinFriendEvent | CancelJoinEvent | OpponentRematch

export type StateOptions = "lobby" | "lobby.idle" | "lobby.waitForOpponent" | "lobby.waitForFriend" | "lobby.joinFriend"
    | "playing" | "playing.no_moves" | "game_over" | "game_over.idle" | "game_over.rematchRequest"

export type State = { value: StateOptions, context: GameContext }

export type RyujinState = StateFrom<typeof ryujinMachine>
export type RyujinEvent = EventFrom<typeof ryujinMachine>

