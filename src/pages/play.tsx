import { usePlay } from "@/lib/play/play-context";
import styles from "./play.module.css";
import SelfPlayerInfo from "@/components/play/self-player-info";
import OpponentPlayerInfo from "@/components/play/opponent-player-info";
import PlayBoard from "@/components/play/play-board";
import { useSelector } from "@xstate/react";
import GameOverModal from "@/components/play/game-over-modal";

export default function PlayPage({ sideBar }: { sideBar: JSX.Element }) {
    const {
        joinRoom,
        onResign,
        onPass,
        createRoom,
        ryujinService
    } = usePlay()
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
    // const isLobby = useSelector(ryujinService, (state) => state.matches('lobby'))
    const isGameOver = useSelector(ryujinService, (state) => state.matches('game_over'))
    // const roomInfo = useSelector(ryujinService, (state) => state.context.roomInfo)
    const hasNoMoves = useSelector(ryujinService, (state) => state.matches('playing.no_moves'))
    // const navigate = useNavigate()
    // const param = useParams()
    // const hasRoom = !!roomInfo?.id

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (!hasRoom && !!param.roomId && roomId !== param.roomId) {
    //             joinRoom(param.roomId);
    //         }
    //     }, 500)
    //     return () => clearTimeout(timer)
    // }, [])


    // useEffect(() => {
    //     if (roomId) navigate({ to: "/play/$roomId", params: { roomId: roomId } })
    // }, [roomId])

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
                {sideBar}
            </div>
            {isPlaying && <button style={{ backgroundColor: "#fff" }} onClick={onResign}>Resign</button>}
        </div>
    )
}

