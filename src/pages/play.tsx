import Board from "@/components/board/board";
import { usePlay } from "@/lib/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";
import { PieceType } from "@/components/board/types";
import Card from "@/components/card/card";

export default function PlayPage() {
    const { joinRoom, hasRoom, roomId, boardPosition, selfColor, hasTurn, isGameStarted, selfCards, opponentCards } = usePlay()

    function isAllowedToMove(piece: PieceType) {
        return hasTurn && piece[0] === selfColor;
    }

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div className={styles.boardlyt}>
                    <Board position={boardPosition} isAllowedToMove={isAllowedToMove} />
                </div>
                <div className={styles.side}>
                    {!hasRoom && !isGameStarted && <RoundButton onClick={joinRoom}>New opponent</RoundButton>}
                    {isGameStarted && <div className={styles.cards}>
                        <div className={styles.cardsuser}>
                            {opponentCards?.map(c => <Card card={c} />)}
                        </div>
                        <Card />
                        <div className={styles.cardsuser}>
                            {selfCards?.map(c => <Card card={c} />)}
                        </div>
                    </div>}
                </div>
            </div>
        </div >
    )
}
