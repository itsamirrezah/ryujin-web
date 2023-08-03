import { io, Socket } from "socket.io-client";
import { CardType, EndGame, PlayerResponse, Position, SquareType } from "./play/types";

export const socket = io(
    `${import.meta.env.VITE_SERVER_BASEURL}/play`,
    { autoConnect: false, withCredentials: true }
) as Socket<ServerEvents, ClientEvents>

export type TimePayload = { whiteRemaining: number, blackRemaining: number }

export type OpponentMovePayload = {
    from: SquareType,
    to: SquareType,
    selectedCard: CardType,
} & TimePayload;

export type JoinRoomPayload = {
    id: string,
    players: PlayerResponse[]
}

export type GamePayload = {
    whiteId: string,
    blackId: string,
    whiteCards: CardType[],
    blackCards: CardType[],
    reserveCards: CardType[],
    boardPosition: Position,
    turnId: string,
    gameTime: number
}
export type EndGamePayload = {
    endGame: EndGame
} & Omit<GamePayload, "gameTime" | "turnId"> & TimePayload

export type RejMovePayload = Omit<GamePayload, "gameTime"> & TimePayload

export type ServerEvents = {
    JOIN_ROOM: (payload: JoinRoomPayload) => void
    START_GAME: (payload: GamePayload) => void
    OPPONENT_MOVED: (payload: OpponentMovePayload) => void,
    END_GAME: (payload: EndGamePayload) => void
    ACK_MOVE: (payload: TimePayload) => void
    REJ_MOVE: (payload: RejMovePayload) => void
    REJ_FLAG: (payload: TimePayload) => void
}

export type ClientEvents = {
    JOIN_ROOM: () => void;
    MOVE: (payload: { playerId: string, roomId: string, from: SquareType, to: SquareType, selectedCard: CardType }) => void
    OPPONENT_FLAG: (roomId: string) => void
}
