import MasterGreenPiece from "../icons/master-green-piece";
import MasterLongBeard from "../icons/master-long-beard";
import MasterLongBeardPiece from "../icons/master-long-beard-piece";
import MasterRedPiece from "../icons/master-red-piece";
import SoldierRedPiece from "../icons/soldier-red-piece";
import StudentGreenPiece from "../icons/student-green-piece";
import StudentRedPiece from "../icons/student-red-piece";

export const BOARD_SIZE = 5;
export const COLUMNS = "abcde";
export const DEFAULT_PIECES = {
    // "wP": StudentRedPiece,
    "wP": SoldierRedPiece,
    // "wK": MasterRedPiece,
    "wK": MasterLongBeardPiece,
    "bP": StudentGreenPiece,
    "bK": MasterGreenPiece
};
export const DND_ITEM_TYPE = "piece";
