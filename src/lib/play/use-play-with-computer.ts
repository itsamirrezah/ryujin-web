import { useSelector } from "@xstate/react";
import { useEffect, useState } from "react";
import { getCardOptions, getPlayersForPlayOffline, NewGameWithComputer } from "./consts";
import { CardType, PieceType, SquareType } from "./types";
import { PlayImp, PlayArgs } from "./use-play-online";

export default function usePlayWithComputer({ ryujinService, gameInfo }: PlayArgs): PlayImp {
    const [deckCards, setDeckCards] = useState<CardType[]>([])
    const { send } = ryujinService
    const isWaitingForComputer = useSelector(ryujinService, (state) => state.matches('lobby.waitingForComputer'))
    const opponentCards = useSelector(ryujinService, (state) => state.context.opponentCards)
    const boardPosition = useSelector(ryujinService, (state) => state.context.boardPosition)
    const selfColor = useSelector(ryujinService, (state) => state.context.selfColor)
    const hasTurn = useSelector(ryujinService, (state) => state.context.hasTurn)

    useEffect(() => {
        if (!isWaitingForComputer) return;
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
    }, [isWaitingForComputer])

    useEffect(() => {
        if (hasTurn || deckCards.length <= 0) return;
        const nextMove = getComputerNextMove()
        if (!nextMove) {
            //should pass turn
            return;
        }
        const { selectedCard, from, to } = nextMove
        const [replacedCard, deck] = subtituteCardWithDeck(selectedCard, deckCards)
        send({ type: "OPPONENT_MOVED", to, from, selectedCard, replacedCard })
        setDeckCards(deck)

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

    function subtituteCardWithDeck(card: CardType, deck: CardType[]) {
        const [replaceCard, ...rest] = deck
        rest.push(card)
        return [replaceCard, rest] as const
    }

    function onMove(from: SquareType, to: SquareType, selectedCard: CardType) {
        send({ type: "MOVE", to, from })
        const [replacedCard, updatedDeck] = subtituteCardWithDeck(selectedCard, deckCards)
        send({ type: "MOVE_CONFIRMED", replacedCard })
        setDeckCards(updatedDeck)
    }

    function onPassTurn() { }
    function onClaimOpponentTimeout() { }
    function onResign() { }
    function onCancelJoin() { }

    return { onMove, onPassTurn, onClaimOpponentTimeout, onResign, onCancelJoin } as PlayImp
}
