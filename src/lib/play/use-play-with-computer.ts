import { useSelector } from "@xstate/react";
import { useEffect, useState } from "react";
import { getCardOptions, getPlayersForPlayOffline, NewGameWithComputer } from "./consts";
import { BlackOrWhite, CardType, PieceType, SquareType, EndGame } from "./types";
import { PlayImp, PlayArgs } from "./use-play-online";

export default function usePlayWithComputer({ ryujinService, gameInfo }: PlayArgs): PlayImp {
    const [deckCards, setDeckCards] = useState<CardType[]>([])
    const { send } = ryujinService
    const isWaitingForComputer = useSelector(ryujinService, (state) => state.matches('lobby.waitingForComputer'))
    const isMovePending = useSelector(ryujinService, (state) => state.matches('playing.pendingMove'))
    const opponentCards = useSelector(ryujinService, (state) => state.context.opponentCards)
    const boardPosition = useSelector(ryujinService, (state) => state.context.boardPosition)
    const selfColor = useSelector(ryujinService, (state) => state.context.selfColor)
    const hasTurn = useSelector(ryujinService, (state) => state.context.hasTurn)
    const selfRemainingTime = useSelector(ryujinService, (state) => state.context.selfRemainingTime)
    const opponentRemainingTime = useSelector(ryujinService, (state) => state.context.opponentRemainingTime)
    const history = useSelector(ryujinService, (state) => state.context.history)
    const playersInfo = useSelector(ryujinService, (state) => state.context.playersInfo)

    useEffect(() => {
        if (!isWaitingForComputer) return;
        startNewGame()
    }, [isWaitingForComputer])

    useEffect(() => {
        if (!isMovePending) return;
        const selectedCard = history[history.length - 2].selectedCard
        if (!selectedCard) return;
        const [replacedCard, updatedDeck] = subtituteCardWithDeck(selectedCard, deckCards)
        send({ type: "MOVE_CONFIRMED", replacedCard })
        setDeckCards(updatedDeck)

    }, [isMovePending, history])

    useEffect(() => {
        if (!selfColor || !playersInfo || (selfRemainingTime > 0 && opponentRemainingTime > 0)) return
        const opponentColor: BlackOrWhite = selfColor === "w" ? "b" : "w"
        const winnerId = selfRemainingTime <= 0 ? playersInfo.opponent.socketId : playersInfo.self.socketId
        const winnerColor = winnerId === playersInfo.self.socketId ? selfColor : opponentColor
        const loserColor = winnerColor === selfColor ? opponentColor : selfColor
        const pieces = Object.values(boardPosition)
        const winnerKing = pieces.find(piece => piece === `${winnerColor}K`)
        const loserKing = pieces.find(piece => piece === `${loserColor}K`)
        let endGame = {} as EndGame
        if (!loserKing || !!winnerKing) {
            endGame = {
                result: "won",
                by: "time",
                playerWon: winnerId,
                playerWonColor: winnerColor
            }
        } else {
            endGame = {
                result: "draw",
                by: "insufficent material",
            }
        }
        send({ type: "GAME_OVER", boardPosition, endGame: endGame })
    }, [selfRemainingTime, opponentRemainingTime])

    useEffect(() => {
        function checkWonByConquer(king: PieceType): boolean {
            const enemyTemple = king[0] === "w" ? "c5" : "c1"
            return boardPosition[enemyTemple] === king
        }
        function checkDrawByInsufficentMaterial(pieces: PieceType[]): boolean {
            return !pieces.find(piece => piece[1] === "K")
        }
        function checkWonBySlaughter(pieces: PieceType[], opponentColor: BlackOrWhite): boolean {
            return !pieces.find(piece => piece[0] === opponentColor)
        }

        if (!selfColor || !playersInfo || history.length <= 1) {
            return;
        }
        const turnColor: BlackOrWhite = hasTurn ? selfColor === "w" ? "b" : "w" : selfColor
        const opponentColor: BlackOrWhite = turnColor === "w" ? "b" : "w"
        const playerId = turnColor === selfColor ? playersInfo.self.socketId : playersInfo.opponent.socketId
        const king: PieceType = `${turnColor}K`
        const pieces = Object.values(boardPosition)
        let endGame: EndGame = {} as EndGame

        if (checkWonByConquer(king)) {
            endGame = {
                result: "won",
                by: "conquer temple",
                playerWon: playerId,
                playerWonColor: turnColor
            }
        } else if (checkDrawByInsufficentMaterial(pieces)) {
            endGame = {
                result: "draw",
                by: "insufficent material",
            }
        } else if (checkWonBySlaughter(pieces, opponentColor)) {
            endGame = {
                result: "won",
                by: "slaughter",
                playerWon: playerId,
                playerWonColor: turnColor
            }
        }

        if (endGame.result) {
            send({ type: "GAME_OVER", boardPosition, endGame })
        }
    }, [history.length])

    useEffect(() => {
        function performComputerMove() {
            const nextMove = getComputerNextMove()
            if (!nextMove) {
                send({ type: "OPPONENT_PASS" })
                return;
            }
            const { selectedCard, from, to } = nextMove
            const [replacedCard, deck] = subtituteCardWithDeck(selectedCard, deckCards)
            send({ type: "OPPONENT_MOVED", to, from, selectedCard, replacedCard })
            setDeckCards(deck)
        }

        if (hasTurn || deckCards.length <= 0) return;
        const timeout = setTimeout(() => {
            performComputerMove()
        }, 1000)

        return () => clearTimeout(timeout)

    }, [hasTurn, deckCards])

    function getComputerNextMove() {
        if (!selfColor || !opponentCards) return;
        const opponentColor = selfColor === "w" ? "b" : "w"
        const opponentPieces = Object.entries(boardPosition).filter(item => item[1][0] === opponentColor) as [SquareType, PieceType][]

        while (opponentPieces.length > 0) {
            const pieceIdx = Math.floor(Math.random() * opponentPieces.length)
            const piece = opponentPieces[pieceIdx]
            const availableCards = opponentCards.slice()
            while (availableCards.length > 0) {
                const cardIdx = Math.floor(Math.random() * availableCards.length)
                const card = availableCards[cardIdx]
                const options = getCardOptions(piece[0], card.delta, opponentColor, boardPosition)
                if (options.length <= 0) {
                    availableCards.splice(cardIdx, 1)
                    continue
                }
                const toIdx = Math.floor(Math.random() * options.length)
                const to = options[toIdx]
                return { selectedCard: card, from: piece[0] as SquareType, to }
            }
            opponentPieces.splice(pieceIdx, 1)
        }
        return null
    }


    function startNewGame() {
        const players = getPlayersForPlayOffline()
        send({ type: "UPDATE_PLAYERS", players, roomId: "999" })
        const newGame = NewGameWithComputer(players, gameInfo)
        const { selfCards, boardPosition, id, deck, time, hasTurn, selfColor, opponentCards } = newGame
        setDeckCards(deck)
        send({
            type: "GAME_STARTED",
            id,
            boardPosition,
            hasTurn,
            selfColor,
            selfCards,
            opponentCard: opponentCards,
            time
        })
    }

    function subtituteCardWithDeck(card: CardType, deck: CardType[]) {
        const [replaceCard, ...rest] = deck
        rest.push(card)
        return [replaceCard, rest] as const
    }

    function onMove(from: SquareType, to: SquareType, selectedCard: CardType) {
        send({ type: "MOVE", to, from, selectedCard })
    }

    function onPassTurn() {
        send({ type: "PASS_TURN" })
    }

    function onClaimOpponentTimeout() { }

    function onResign() {
        if (!playersInfo || !selfColor) return;
        const opponentId = playersInfo.opponent.socketId
        const opponentColor = selfColor === "w" ? "b" : "w"
        const endGame = {
            result: "won",
            by: "resignation",
            playerWon: opponentId,
            playerWonColor: opponentColor
        } as EndGame
        send({ type: "GAME_OVER", endGame, boardPosition: boardPosition })
    }

    function onCancelJoin() {
        send({ type: "LEAVE_ROOM" })
    }

    function onRematch() {
        startNewGame()
    }

    return {
        onMove,
        onPassTurn,
        onClaimOpponentTimeout,
        onResign,
        onCancelJoin,
        onRematch,
        prevOpponent: playersInfo?.opponent,
        isRoomActionInProgress: false,
    }
}
