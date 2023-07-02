export type Room = {
    id: string;
    players: string[];
}
export type Player = {
    name: string,
    socketId: string,
    color: "w" | "b" | undefined
}
