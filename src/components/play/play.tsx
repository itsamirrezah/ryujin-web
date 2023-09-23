import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import GameOverModal from "./game-over-modal"
import OpponentPlayerInfo from "./opponent-player-info"
import PlayBoard from "./play-board"
import SelfPlayerInfo from "./self-player-info"

export default function Play() {
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

}
