import Board from "@/components/board/board";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";

export default function PlayPage() {
    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div className={styles.board}>
                    <Board />
                </div>
                <div className={styles.actions}>
                    <RoundButton>New opponent</RoundButton>
                    <RoundButton>Rematch</RoundButton>
                </div>
            </div>
        </div >
    )
}
