import Board from "@/components/board/board";
import { usePlay } from "@/lib/play/play-context";
import RoundButton from "@/components/round-button/round-button";
import styles from "./play.module.css";
import { PieceType, SquareType } from "@/lib/play/types";
import Card from "@/components/card/card";
import PlayerInfo from "@/components/player-info/player-info";

export default function PlayPage() {
    const {
        joinRoom,
        playersInfo,
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
            <div className={styles.game}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <PlayerInfo
                        name={playersInfo?.opponent?.username}
                        remainingTime={opponentRemainingTime}
                        hasTurn={!hasTurn}
                        isClockActive={gameStarted}
                        color={selfColor === "w" ? "b" : "w"}
                    />
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
                    <PlayerInfo
                        name={playersInfo?.self?.username}
                        remainingTime={selfRemainingTime}
                        hasTurn={hasTurn}
                        isClockActive={gameStarted}
                        color={selfColor === "w" ? "w" : "b"}
                    />
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
        </div>
    )
}

