import { useSelector } from "@xstate/react";
import { useEffect, useState } from "react";
import { getPlayersForPlayOffline, NewGameWithComputer } from "./consts";
import { CardType, SquareType } from "./types";
import { PlayImp, PlayArgs } from "./use-play-online";

export default function usePlayWithComputer({ ryujinService, gameInfo }: PlayArgs): PlayImp {
    const { send } = ryujinService
    const isWaitingForComputer = useSelector(ryujinService, (state) => state.matches('lobby.waitingForComputer'))
    const [deckCards, setDeckCards] = useState<CardType[]>([])

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

    function onMove(from: SquareType, to: SquareType, selectedCard: CardType) { }
    function onPassTurn() { }
    function onClaimOpponentTimeout() { }
    function onResign() { }
    function onCancelJoin() { }

    return { onMove, onPassTurn, onClaimOpponentTimeout, onResign, onCancelJoin } as PlayImp
}
