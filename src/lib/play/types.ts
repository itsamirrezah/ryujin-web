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
    reserveCards: CardType[],
    gameTime: number
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
