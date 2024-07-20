import { useInterpret } from "@xstate/react";
import { createContext, ReactNode, useContext, useState } from "react";
import { InterpreterFrom } from "xstate";
import { ryujinMachine } from "./ryujin-machine";
import { CardType, PieceType, PlayerResponse, SquareType } from "./types";
import usePlayOnline from "./use-play-online";
import usePlayWithComputer from "./use-play-with-computer";

type PlayValues = {
    onQuickMatch: (roomId?: string) => void,
    onCardSelected: (card: CardType) => void,
    onPieceSelected: (piece: PieceType, square: SquareType) => void,
    onMove: (from: SquareType, to: SquareType, selectedCard: CardType) => void,
    onPassTurn: () => void
    onClaimOpponentTimeout: () => void,
    onResign: () => void,
    onRematch: () => void
    onInviteFriend: () => void,
    onJoinFriend: (roomId: string) => void,
    onCancelJoin: () => void,
    prevOpponent?: PlayerResponse,
    gameTime: number,
    numberOfCards: number,
    setGameInfo: (gameTime: number, numberOfCards: number) => void,
    isRoomActionInProgress: boolean,
    onNavigateBack: () => void,
    onNavigateForward: () => void,
    ryujinService: InterpreterFrom<typeof ryujinMachine>
}

const PlayContext = createContext({} as PlayValues);

export default function PlayContextProvider({ children }: { children: ReactNode }) {
    const ryujinService = useInterpret(ryujinMachine)
    const { send } = ryujinService
    const [time, setTime] = useState(480000)
    const [numberOfCards, setNumberOfCards] = useState(16)
    const [playingMode, setPlayingMode] = useState<0 | 1 | 2>(0)
    const playOnline = usePlayOnline({ ryujinService, gameInfo: { time, numberOfCards } })
    const playOffline = usePlayWithComputer({ ryujinService, gameInfo: { time, numberOfCards } })
    const rootPlay = playingMode === 1 ? playOnline : playOffline

    function onQuickMatch() {
        setPlayingMode(1)
        send({ type: "QUICK_MATCH" })
    }
    function onInviteFriend() {
        setPlayingMode(1)
        send({ type: "INVITE_FRIEND" })
    }

    function onJoinFriend(roomId: string) {
        setPlayingMode(1)
        send({ type: "JOIN_FRIEND", roomId })
    }

    function onCardSelected(card: CardType) {
        send({ type: "SELECT_CARD", card })
    }

    function onPieceSelected(piece: PieceType, square: SquareType) {
        send({ type: "SELECT_PIECE", piece, square })
    }

    function setGameInfo(gameTimeArg: number, numberOfCardsArg: number) {
        setTime(gameTimeArg)
        setNumberOfCards(numberOfCardsArg)
    }

    function onNavigateBack() {
        send({ type: "NAVIGATE_BACK" })
    }

    function onNavigateForward() {
        send({ type: "NAVIGATE_FORWARD" })
    }

    return (
        <PlayContext.Provider value={{
            onCardSelected,
            onPieceSelected,
            onJoinFriend,
            ryujinService,
            gameTime: time,
            numberOfCards,
            setGameInfo,
            onNavigateBack,
            onNavigateForward,
            onQuickMatch,
            onInviteFriend,
            ...rootPlay,
        }}>
            {children}
        </PlayContext.Provider>
    );
};

export function usePlay() {
    const ctx = useContext(PlayContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
