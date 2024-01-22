import { usePlay } from "@/lib/play/play-context";
import styles from "./play.module.css";
import SelfPlayerInfo from "@/components/play/self-player-info";
import OpponentPlayerInfo from "@/components/play/opponent-player-info";
import PlayBoard from "@/components/play/play-board";
import { useSelector } from "@xstate/react";
import SelfCards from "@/components/play/selfCards";
import OpponentCards from "@/components/play/opponentCards";
import { useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import GameOverModal from "@/components/play/game-over-modal";
import SideBarButton from "@/components/play/side-bar-button"; import DiceIcon from "@/components/icons/dice";
import ChainIcon from "@/components/icons/chain";

export default function PlayPage() {
    const {
        onQuickMatch,
        onResign,
        onPass,
        createRoom,
        ryujinService
    } = usePlay()
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
    const isLobby = useSelector(ryujinService, (state) => state.matches('lobby'))
    const isGameOver = useSelector(ryujinService, (state) => state.matches('game_over'))
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)
    const hasNoMoves = useSelector(ryujinService, (state) => state.matches('playing.no_moves'))
    const navigate = useNavigate()
    const param = useParams({ from: "/play" })
    const hasRoom = !!roomId

    //FIXME
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (!hasRoom && !!param.roomId && roomId !== param.roomId) {
    //             joinRoom(param.roomId);
    //         }
    //     }, 500)
    //     return () => clearTimeout(timer)
    // }, [])


    useEffect(() => {
        if (roomId) navigate({ to: "/play/$roomId", params: { roomId: roomId } })
    }, [roomId])

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div className={styles.boardlyt}>
                    <OpponentPlayerInfo />
                    <PlayBoard />
                    <SelfPlayerInfo />
                    {hasNoMoves && <button style={{ color: "#fff", padding: 4 }} onClick={onPass}>Pass Turn</button>}
                    {isGameOver && <GameOverModal />}
                </div>
                {isLobby && (
                    <div className={styles.side}>
                        <div className={styles.sideoptions}>
                            <SideBarButton icon={<DiceIcon />} onClick={() => onQuickMatch()}>Quick Match</SideBarButton>
                            <SideBarButton icon={<ChainIcon />} onClick={createRoom}>With Friends</SideBarButton>
                        </div>
                    </div>
                )}
                {isPlaying && <div className={styles.cards}>
                    <div className={styles.cardsuser}>
                        <OpponentCards />
                    </div>
                    <div className={styles.cardsuser}>
                        <SelfCards />
                    </div>
                    {isPlaying && <button style={{ backgroundColor: "#fff" }} onClick={onResign}>Resign</button>}
                </div>}
            </div>
        </div>
    )
}

