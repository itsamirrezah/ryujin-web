import Board from "@/components/board/board";

export default function PlayPage() {
    return (
        <div>
            <h1>Play</h1>
            <p>Play page!</p>
            <div style={{ width: 700, height: 700 }}>
                <Board />
            </div>
        </div >
    )
}
