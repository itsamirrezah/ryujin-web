import MasterGreenPiece from "../icons/master-green-piece";
import MasterRedPiece from "../icons/master-red-piece";
import StudentGreenPiece from "../icons/student-green-piece";
import StudentRedPiece from "../icons/student-red-piece";
import { Position } from "./types";


export const DEFAULT_POSITION: Position = {
    a1: "wP", b1: "wP", c1: "wK", d1: "wP", e1: "wP",
    a5: "bP", b5: "bP", c5: "bK", d5: "bP", e5: "bP"
}
export const BOARD_SIZE = 5;
export const COLUMNS = "abcde";
export const DEFAULT_PIECES = { "wP": StudentRedPiece, "wK": MasterRedPiece, "bP": StudentGreenPiece, "bK": MasterGreenPiece };
