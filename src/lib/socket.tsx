import { io, Socket } from "socket.io-client";
import { CardType, EndGame, PlayerResponse, Position, SquareType } from "./play/types";

export const socket = io(
    `${import.meta.env.VITE_SERVER_BASEURL}/play`,
    { autoConnect: false, withCredentials: true, transports: ["websocket"] }
) as Socket<ServerEvents, ClientEvents>

export type TimePayload = { whiteRemaining: number, blackRemaining: number }

export type OpponentMovePayload = ({
    type: "move",
    from: SquareType,
    to: SquareType,
    selectedCard: CardType,
    replacedCard: CardType,
} | {
    type: "pass"
}) & TimePayload;

export type UpdatePlayersPayload = {
    id: string,
    players: PlayerResponse[]
}

export type GamePayload = {
    id: string,
    whiteId: string,
    blackId: string,
    whiteCards: CardType[],
    blackCards: CardType[],
    boardPosition: Position,
    turnId: string,
    gameTime: number
}
export type EndGamePayload = {
    endGame: EndGame
} & Omit<GamePayload, "gameTime" | "turnId"> & TimePayload

export type MoveRejectedPayload = Omit<GamePayload, "gameTime"> & TimePayload

export type MoveConfirmedPayload = {
    replacedCard: CardType
} & TimePayload

export type GameInfo = {
    time: number,
    numberOfCards: number
}

export type ServerEvents = {
    UPDATE_PLAYERS: (payload: UpdatePlayersPayload) => void
    START_GAME: (payload: GamePayload) => void
    OPPONENT_MOVED: (payload: OpponentMovePayload) => void
    END_GAME: (payload: EndGamePayload) => void
    MOVE_CONFIRMED: (payload: MoveConfirmedPayload) => void
    MOVE_REJECTED: (payload: MoveRejectedPayload) => void
    TIMEOUT_REJECTED: (payload: TimePayload) => void
    OPPONENT_REMATCH: () => void;
}

export type ClientEvents = {
    JOIN_ROOM: (payload?: { roomId: string, gameInfo: GameInfo }) => void;
    CREATE_ROOM: (payload?: { time: number, numberOfCards: number }) => void;
    MOVE: (payload: { playerId: string, gameId: string, from: SquareType, to: SquareType, selectedCard: CardType }) => void;
    LEAVE_ROOM: () => void;
    CLAIM_OPPONENT_TIMEOUT: (gameId: string) => void;
    RESIGNATION: (payload: { playerId: string, gameId: string }) => void;
    PASS_TURN: (payload: { playerId: string, gameId: string }) => void;
    REQUEST_REMATCH: (payload: { playerId: string, gameId: string }) => void;
}
