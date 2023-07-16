import Board from "@/components/board/board";
import { usePlay } from "@/lib/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";
import { PieceType, SquareType } from "@/lib/play/types";
import Card from "@/components/card/card";

export default function PlayPage() {
    const {
        joinRoom,
        roomId,
        boardPosition,
        selfColor,
        hasTurn,
        gameStarted,
        selfCards,
        opponentCards,
        selectedCard,
        onCardSelected,
        onPieceSelected,
        selectedPiece,
        moveOptions,
        selfRemainingTime,
        opponentRemainingTime,
        onMove
    } = usePlay()

    function isAllowedToMove(piece: PieceType) {
        return hasTurn && piece[0] === selfColor;
    }

    function onPieceSelectedHandler(piece: PieceType, square: SquareType) {
        onPieceSelected(piece, square)
    }

    return (
        <div className={styles.main}>
            <div style={{ color: "white" }}>opponentTime: {Math.ceil(opponentRemainingTime / 1000)}s , {opponentRemainingTime}</div>
            <div className={styles.game}>
                <div className={styles.boardlyt}>
                    <Board
                        currentPosition={boardPosition}
                        isPieceDraggable={isAllowedToMove}
                        currentView={selfColor}
                        onPieceDrag={onPieceSelectedHandler}
                        moveOptions={moveOptions}
                        onPieceDrop={onMove}
                    />
                </div>
                <div className={styles.side}>
                    {!roomId && !gameStarted && <RoundButton onClick={joinRoom}>New opponent</RoundButton>}
                    {gameStarted && <div className={styles.cards}>
                        <div className={styles.cardsuser}>
                            {opponentCards?.map(c => <Card card={c} onSelected={(card) => onCardSelected(card)} isSelected={selectedCard?.name === c.name} />)}
                        </div>
                        <Card />
                        <div className={styles.cardsuser}>
                            {selfCards?.map(c => <Card card={c} onSelected={(card) => onCardSelected(card)} isSelected={selectedCard?.name === c.name} />)}
                        </div>
                    </div>}
                </div>
            </div>
            <div style={{ color: "white" }}>selfTime: {Math.ceil(selfRemainingTime / 1000)}s {selfRemainingTime}</div>
        </div>
    )
}
