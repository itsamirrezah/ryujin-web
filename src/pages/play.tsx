import Board from "@/components/board/board";
import { usePlay } from "@/lib/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";
import { PieceType, SquareType } from "@/components/board/types";
import Card from "@/components/card/card";

export default function PlayPage() {
    const {
        joinRoom,
        hasRoom,
        roomId,
        boardPosition,
        selfColor,
        hasTurn,
        isGameStarted,
        selfCards,
        opponentCards,
        selectedCard,
        selectCard,
        selectPiece,
        selectedPiece
    } = usePlay()

    console.log({ selectedPiece })
    function isAllowedToMove(piece: PieceType) {
        return hasTurn && piece[0] === selfColor;
    }

    function onPieceSelectedHandler(square: SquareType) {
        selectPiece(square)
    }

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div className={styles.boardlyt}>
                    <Board position={boardPosition} isAllowedToMove={isAllowedToMove} currentView={selfColor} onPieceSelected={onPieceSelectedHandler} />
                </div>
                <div className={styles.side}>
                    {!hasRoom && !isGameStarted && <RoundButton onClick={joinRoom}>New opponent</RoundButton>}
                    {isGameStarted && <div className={styles.cards}>
                        <div className={styles.cardsuser}>
                            {opponentCards?.map(c => <Card card={c} onSelected={(card) => selectCard(card)} isSelected={selectedCard?.name === c.name} />)}
                        </div>
                        <Card />
                        <div className={styles.cardsuser}>
                            {selfCards?.map(c => <Card card={c} onSelected={(card) => selectCard(card)} isSelected={selectedCard?.name === c.name} />)}
                        </div>
                    </div>}
                </div>
            </div>
        </div >
    )
}
