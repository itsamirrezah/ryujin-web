
export type PieceType = "wP" | "wK" | "bP" | "bK";

export type SquareType =
    "a5" | "b5" | "c5" | "d5" | "e5" |
    "a4" | "b4" | "c4" | "d4" | "e4" |
    "a3" | "b3" | "c3" | "d3" | "e3" |
    "a2" | "b2" | "c2" | "d2" | "e2" |
    "a1" | "b1" | "c1" | "d1" | "e1"

export type Position = { [key in SquareType]?: PieceType }
export type PlayerView = "w" | "b";
export type DndItem = { from: SquareType };
