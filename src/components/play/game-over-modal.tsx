import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
export default function GameOverModal() {
    const { ryujinService } = usePlay()
    const gameOver = useSelector(ryujinService, (state) => state.context.endGame)
    return (
        <div style={{
            background: "#fff", color: "#000", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", boxShadow: "0 .3rem .4rem .1rem rgba(0,0,0,.2)", minWidth: "30rem",
        }}>
            <div id="header" style={{
                height: "10rem", backgroundColor: "green", clipPath: "ellipse(65% 77% at 50% -3%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", marginBottom: -20
            }}>
                <div>{gameOver?.result}</div>
                <div>{gameOver?.by}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-evenly", }}>
                <PlayerResult color="red" result={.5} name="itsamirrezah@gmail.com" />
                <PlayerResult color="green" result={0} />
            </div>
        </div>
    )
}

function PlayerResult({ color, result, name }: any) {
    return (
        <div id="player" style={{
            width: "9rem",
        }}>
            <div style={{
                width: "9rem", height: "9rem", backgroundColor: color, display: "flex", justifyContent: "center", alignItems: "center"
            }}>
                <span style={{ fontSize: 50 }}>{result}</span>
            </div>
            <span style={{ textOverflow: "ellipsis", overflow: "hidden", maxWidth: "100%", display: "inline-block" }}>{name}</span>
        </div>
    )
}
