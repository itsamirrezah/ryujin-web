import { Position } from "@/components/board/types";

export type Room = {
    id: string;
    players: string[];
}
export type Player = {
    name: string,
    socketId: string,
    color: "w" | "b" | undefined
}

export type Game = {
    id: string,
    roomId: string,
    turnColor: "w" | "b",
    playerW: string,
    playerB: string,
    boardPosition: Position
}
