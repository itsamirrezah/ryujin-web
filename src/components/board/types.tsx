import { PieceType, SquareType } from "@/lib/play/types";

export type DndItem = { from: SquareType, piece: PieceType };

export type Move = {
    from: SquareType | undefined
    to: SquareType | undefined
}
export type Coord = { x: number, y: number }
export type Coordinates = { [key in SquareType]?: Coord }
