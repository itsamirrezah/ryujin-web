import Board from "@/components/board/board";
import { usePlay } from "@/lib/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";
import { PieceType, SquareType } from "@/lib/play/types";
import Card from "@/components/card/card";

export default function PlayPage() {
    const {
        joinRoom,
        roomId,
        boardPosition,
        selfColor,
        hasTurn,
        gameStarted,
        selfCards,
        opponentCards,
        selectedCard,
        onCardSelected,
        onPieceSelected,
        selectedPiece,
        moveOptions,
        selfRemainingTime,
        opponentRemainingTime,
        onMove
    } = usePlay()

    function isAllowedToMove(piece: PieceType) {
        return hasTurn && piece[0] === selfColor;
    }

    function onPieceSelectedHandler(piece: PieceType, square: SquareType) {
        if (piece[0] !== selfColor) return
        onPieceSelected(piece, square)
    }

    return (
        <div className={styles.main}>
            {/**<div style={{ color: "white" }}>opponentTime: {Math.ceil(opponentRemainingTime / 1000)}s , {opponentRemainingTime}</div>*/}
            <div className={styles.game}>
                <div>
                    <PlayerInfo />
                    <div className={styles.boardlyt}>
                        <Board
                            currentPosition={boardPosition}
                            isPieceDraggable={isAllowedToMove}
                            currentView={selfColor}
                            onPieceDrag={onPieceSelectedHandler}
                            moveOptions={moveOptions}
                            onPieceDrop={onMove}
                        />
                    </div>
                    <PlayerInfo />
                </div>
                <div className={styles.side}>
                    {!roomId && !gameStarted && <RoundButton onClick={joinRoom}>New opponent</RoundButton>}
                    {gameStarted && <div className={styles.cards}>
                        <div className={styles.cardsuser}>
                            {opponentCards?.map(c => (
                                <Card
                                    card={c}
                                    onSelected={(card) => onCardSelected(card)}
                                    isSelected={selectedCard?.name === c.name}
                                    optionColor={selfColor === "w" ? "b" : "w"}
                                />)
                            )}
                        </div>
                        <Card />
                        <div className={styles.cardsuser}>
                            {selfCards?.map(c => (
                                <Card card={c}
                                    onSelected={(card) => onCardSelected(card)}
                                    isSelected={selectedCard?.name === c.name}
                                    optionColor={selfColor}
                                />)
                            )}
                        </div>
                    </div>}
                </div>
            </div>
            {/** <div style={{ color: "white" }}>selfTime: {Math.ceil(selfRemainingTime / 1000)}s {selfRemainingTime}</div>*/}
        </div>
    )
}

function PlayerInfo() {
    return (
        <div style={{ color: "white", display: "flex", justifyContent: "space-between" }}>
            <span>Username</span>
            <div style={{ backgroundColor: "black", color: "white", borderRadius: 4, padding: 4, display: "flex", gap: 8 }}>
                <svg fill="white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M5.48,9a.93.93,0,0,0-.3.71v.58a.94.94,0,0,0,.3.71,1,1,0,0,0,.71.3h4.58a1,1,0,0,0,.71-.3.94.94,0,0,0,.29-.71V9.7A.92.92,0,0,0,11.48,9a1,1,0,0,0-.71-.27H6.19A1,1,0,0,0,5.48,9Z"></path><path d="M19.22,6.1a9.9,9.9,0,0,0-2.14-3.18A10.23,10.23,0,0,0,13.9.78,9.76,9.76,0,0,0,10,0,9.86,9.86,0,0,0,6.1.78,10,10,0,0,0,.78,6.1,9.81,9.81,0,0,0,0,10a9.81,9.81,0,0,0,.78,3.9A10,10,0,0,0,6.1,19.22,9.86,9.86,0,0,0,10,20a9.76,9.76,0,0,0,3.89-.78,10.23,10.23,0,0,0,3.18-2.14,9.9,9.9,0,0,0,2.14-3.18A9.81,9.81,0,0,0,20,10,9.81,9.81,0,0,0,19.22,6.1ZM17.07,13a7.65,7.65,0,0,1-1.65,2.42A7.81,7.81,0,0,1,13,17.06a7.46,7.46,0,0,1-3,.6,7.51,7.51,0,0,1-3-.6,7.74,7.74,0,0,1-2.43-1.65A8,8,0,0,1,2.94,13a7.46,7.46,0,0,1-.6-3,7.46,7.46,0,0,1,.6-3A8,8,0,0,1,4.58,4.59,7.74,7.74,0,0,1,7,2.94a7.51,7.51,0,0,1,3-.6,7.45,7.45,0,0,1,3,.6,7.74,7.74,0,0,1,2.43,1.65A7.65,7.65,0,0,1,17.07,7a7.46,7.46,0,0,1,.6,3A7.46,7.46,0,0,1,17.07,13Z"></path></svg>
                0:10
            </div>
        </div>
    )
}
