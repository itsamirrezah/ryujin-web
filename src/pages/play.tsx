import Board from "@/components/board/board";
import { usePlay } from "@/components/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";

export default function PlayPage() {
    const { joinRoom, hasRoom, roomId } = usePlay()

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div className={styles.boardlyt}>
                    <Board />
                </div>
                <div className={styles.side}>
                    {!hasRoom && <RoundButton onClick={joinRoom}>New opponent</RoundButton>}
                    {hasRoom && <span>{`game started @${roomId}`}</span>}
                </div>
            </div>
        </div >
    )
}
