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
import { useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/router";
import GameOverModal from "@/components/play/game-over-modal";

export default function PlayPage() {
    const {
        joinRoom,
        onResign,
        onPass,
        createRoom,
        ryujinService
    } = usePlay()
    const isGameStarted = useSelector(ryujinService, (state) => state.context.gameStarted)
    const isPlaying = useSelector(ryujinService, (state) => state.matches('idle'))
    const isGameOver = useSelector(ryujinService, (state) => state.matches('game_over'))
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)
    const hasNoMoves = useSelector(ryujinService, (state) => state.matches('idle.no_moves'))
    const navigate = useNavigate()
    const param = useParams()
    const hasRoom = !!roomId

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasRoom && !!param.roomId && roomId !== param.roomId) {
                joinRoom(param.roomId);
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [])


    useEffect(() => {
        if (roomId) navigate({ to: "/play/$roomId", params: { roomId: roomId } })
    }, [roomId])

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <OpponentPlayerInfo />
                    <div className={styles.boardlyt}>
                        <PlayBoard />
                        {isGameOver && <GameOverModal />}
                    </div>
                    <SelfPlayerInfo />
                    {hasNoMoves && <button style={{ color: "#fff", padding: 4 }} onClick={onPass}>Pass Turn</button>}
                </div>
                <div className={styles.side}>
                    {!hasRoom && !isGameStarted && <RoundButton onClick={() => joinRoom()}>Random</RoundButton>}
                    {!hasRoom && !isGameStarted && <RoundButton onClick={createRoom}>With Friends</RoundButton>}
                    {isGameStarted && <div className={styles.cards}>
                        <div className={styles.cardsuser}>
                            <OpponentCards />
                        </div>
                        <Card />
                        <div className={styles.cardsuser}>
                            <SelfCards />
                        </div>
                        {isPlaying && <button style={{ backgroundColor: "#fff" }} onClick={onResign}>Resign</button>}
                    </div>}
                </div>
            </div>
        </div >
    )
}

