import Board from "@/components/board/board";
import { usePlay } from "@/lib/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";
import { PieceType, SquareType } from "@/components/board/types";

export default function PlayPage() {
    const { joinRoom, hasRoom, roomId, boardPosition, selfColor, hasTurn } = usePlay()

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
                    {!hasRoom && <RoundButton onClick={joinRoom}>New opponent</RoundButton>}
                    {hasRoom && <span>{`game started @${roomId}`}</span>}
                </div>
            </div>
        </div >
    )
}
