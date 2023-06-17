import Board from "@/components/board/board";
import Card from "@/components/card/card";
import { usePlay } from "@/components/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";

export default function PlayPage() {
    const { joinRoom } = usePlay()

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div className={styles.boardlyt}>
                    <Board />
                </div>
                <div className={styles.side}>
                    <RoundButton onClick={joinRoom}>New opponent</RoundButton>
                    <Card />
                </div>
            </div>
        </div >
    )
}
