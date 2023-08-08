import { io, Socket } from "socket.io-client";
import { CardType, EndGame, PlayerResponse, Position, SquareType } from "./play/types";

export const socket = io(
    `${import.meta.env.VITE_SERVER_BASEURL}/play`,
    { autoConnect: false, withCredentials: true }
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

export type JoinRoomPayload = {
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

export type RejMovePayload = Omit<GamePayload, "gameTime"> & TimePayload

export type AckMovePayload = {
    replacedCard: CardType
} & TimePayload

export type ServerEvents = {
    JOIN_ROOM: (payload: JoinRoomPayload) => void
    START_GAME: (payload: GamePayload) => void
    OPPONENT_MOVED: (payload: OpponentMovePayload) => void,
    END_GAME: (payload: EndGamePayload) => void
    ACK_MOVE: (payload: AckMovePayload) => void
    REJ_MOVE: (payload: RejMovePayload) => void
    REJ_FLAG: (payload: TimePayload) => void
}

export type ClientEvents = {
    JOIN_ROOM: (payload?: { roomId: string }) => void;
    MOVE: (payload: { playerId: string, gameId: string, from: SquareType, to: SquareType, selectedCard: CardType }) => void;
    OPPONENT_FLAG: (gameId: string) => void;
    RESIGNATION: (payload: { playerId: string, gameId: string }) => void;
    CREATE_ROOM: () => void,
    PASS: (payload: { playerId: string, gameId: string }) => void
    REMATCH: (payload: { playerId: string, gameId: string }) => void

}
