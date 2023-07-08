import { Position } from "@/components/board/types";
import { Card } from "./consts";

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
    boardPosition: Position,
    whiteCards: [Card, Card],
    blackCards: [Card, Card],
    reserveCards: Card[]
}
