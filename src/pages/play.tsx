import { usePlay } from "@/lib/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";
import Card from "@/components/card/card";
import SelfPlayerInfo from "@/components/play/self-player-info";
import OpponentPlayerInfo from "@/components/play/opponent-player-info";
import PlayBoard from "@/components/play/play-board";
import { useSelector } from "@xstate/react";
import SelfCards from "@/components/play/selfCards";
import OpponentCards from "@/components/play/opponentCards";

export default function PlayPage() {
    const {
        joinRoom,
        onResign,
        ryujinService
    } = usePlay()
    const isGameStarted = useSelector(ryujinService, (state) => state.context.gameStarted)
    const isPlaying = useSelector(ryujinService, (state) => state.matches('idle'))
    const hasRoom = useSelector(ryujinService, (state) => !!state.context.roomId)

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <OpponentPlayerInfo />
                    <div className={styles.boardlyt}>
                        <PlayBoard />
                    </div>
                    <SelfPlayerInfo />
                </div>
                <div className={styles.side}>
                    {!hasRoom && !isGameStarted && <RoundButton onClick={joinRoom}>New opponent</RoundButton>}
                    {isGameStarted && <div className={styles.cards}>
                        <div className={styles.cardsuser}>
                            <OpponentCards />
                        </div>
                        <Card />
                        <div className={styles.cardsuser}>
                            <SelfCards />
                        </div>
                        {isPlaying && <button style={{ backgroundColor: "#fff" }} onClick={onResign}> Resign</button>}
                    </div>}
                </div>
            </div>
        </div >
    )
}

