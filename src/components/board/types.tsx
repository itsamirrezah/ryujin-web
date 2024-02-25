import { PieceType, SquareType } from "@/lib/play/types";

export type DndItem = { from: SquareType, piece: PieceType };

export type Move = {
    from: SquareType,
    to: SquareType
}
export type Coord = { x: number, y: number }
export type Coordinates = { [key in SquareType]?: Coord }
