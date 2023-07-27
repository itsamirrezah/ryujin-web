import { usePlay } from "@/lib/play/play-context";
import { PieceType, SquareType } from "@/lib/play/types";
import { useSelector } from "@xstate/react";
import Board from "../board/board";

export default function PlayBoard() {
    const { ryujinService, onMove, onPieceSelected } = usePlay()
    const boardPosition = useSelector(ryujinService, (state) => state.context.boardPosition)
    const selfColor = useSelector(ryujinService, (state) => state.context.selfColor)
    const moveOptions = useSelector(ryujinService, (state) => state.context.moveOptions)
    const hasTurn = useSelector(ryujinService, (state) => state.context.hasTurn)
    const selectedPiece = useSelector(ryujinService, (state) => state.context.selectedPiece)
    const selectedCard = useSelector(ryujinService, (state) => state.context.selectedCard)

    function isAllowedToMove(piece: PieceType) {
        return hasTurn && piece[0] === selfColor;
    }

    function onMoveHandler(to: SquareType) {
        if (!selectedPiece || !selectedCard) return
        onMove(selectedPiece.square, to, selectedCard)
    }

    function onPieceSelectedHandler(piece: PieceType, square: SquareType) {
        if (piece[0] !== selfColor) return
        onPieceSelected(piece, square)
    }
    return (
        <Board
            currentPosition={boardPosition}
            isPieceDraggable={isAllowedToMove}
            currentView={selfColor}
            onPieceDrag={onPieceSelectedHandler}
            moveOptions={moveOptions}
            onPieceDrop={onMoveHandler}
        />
    )
}
