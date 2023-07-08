import { Position } from "@/components/board/types";

export type Room = {
    id: string;
    players: string[];
}
export type Player = {
    name: string,
    socketId: string,
}

export type Game = {
    id: string,
    roomId: string,
    turnColor: "w" | "b",
    turnId: string,
    whiteId: string,
    blackId: string,
    boardPosition: Position
}
