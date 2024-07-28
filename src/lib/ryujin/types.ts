import { EventFrom, StateFrom } from "xstate";
import {
    BlackOrWhite, 
    CardType, 
    EndGame, 
    PieceType, 
    PlayerResponse, 
    Position, 
    SquareType 
} from "../play/types";
import { ryujinMachine } from "./ryujin-machine";

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
    hasFlagInProgress: boolean,
    history: History[],
    currentHistory: number,
}

type History = {
    boardPosition: Position,
    selfCards: [CardType, CardType],
    opponentCards: [CardType, CardType],
    selectedCard?: CardType,
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

export type PlayOfflineEvent = { type: "PLAY_OFFLINE" }

export type LeaveRoomEvent = {
    type: "LEAVE_ROOM",
}

export type RematchEvent = {
    type: "REMATCH"
}

export type UpdatePlayersEvent = {
    type: "UPDATE_PLAYERS",
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
export type MoveEvent = { type: "MOVE", from: SquareType, to: SquareType, selectedCard: CardType }
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
export type MoveRejectedEvent = {
    type: "MOVE_REJECTED",
    boardPosition: Position,
    selfColor: BlackOrWhite,
    hasTurn: boolean,
    selfCards: [CardType, CardType],
    opponentCards: [CardType, CardType],
}
export type GameOverEvent = {
    type: "GAME_OVER"
    boardPosition?: Position,
    selfColor?: BlackOrWhite,
    selfCards?: [CardType, CardType],
    opponentCards?: [CardType, CardType],
    endGame: EndGame,
    selfRemainingTime?: number,
    opponentRemainingTime?: number
}
export type NavigateBackEvent = {
    type: "NAVIGATE_BACK"
}
export type NavigateForwardEvent = {
    type: "NAVIGATE_FORWARD"
}
export type OpponentRematch = {
    type: "OPPONENT_REMATCH"
}
export type ClaimOpponentTimeoutEvent = { type: "CLAIM_OPPONENT_TIMEOUT" }

export type TimeoutRejectedEvent = { type: "TIMEOUT_REJECTED" }

export type PassTurnEvent = { type: "PASS_TURN" }

export type OpponentPassEvent = { type: "OPPONENT_PASS" }

export type Events =
    | UpdatePlayersEvent | GameStartedEvent | SelectCardEvent | SelectPieceEvent
    | MoveEvent | OpponentMoveEvent | MoveConfirmedEvent | TickEvent
    | UpdateTimeEvent | MoveRejectedEvent | GameOverEvent | ClaimOpponentTimeoutEvent
    | TimeoutRejectedEvent | PassTurnEvent | OpponentPassEvent | QuickMatchEvent | InviteFriendEvent | PlayOfflineEvent
    | JoinFriendEvent | LeaveRoomEvent | OpponentRematch | RematchEvent | NavigateBackEvent | NavigateForwardEvent

export type StateOptions =
    | "lobby" | "lobby.idle" | "lobby.waitingForOpponent" | "lobby.waitingForFriend" | "lobby.friendInJoinLobby" | "lobby.waitingForRematch" | "lobby.waitingForComputer"
    | "playing" | "playing.isOutOfMoves" | "playing.normal" | "playing.noMove" | "playing.pendingMove"
    | "gameOver" | "gameOver.idle" | "gameOver.opponentRematchRequest"

export type State = { value: StateOptions, context: GameContext }
export type RyujinState = StateFrom<typeof ryujinMachine>
export type RyujinEvent = EventFrom<typeof ryujinMachine>
