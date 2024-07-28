import { useInterpret } from "@xstate/react";
import {
    createContext,
    ReactNode,
    useContext,
    useState
} from "react";
import { InterpreterFrom } from "xstate";
import PlayOnline from "../play-online/play-online";
import PlayWithComputer from "../play-with-computer/play-with-computer";
import { ryujinMachine } from "../ryujin/ryujin-machine";
import { CardType, PieceType, SquareType, GameContext } from "./types";

type PlayValues = {
    onQuickMatch: (roomId?: string) => void,
    onCardSelected: (card: CardType) => void,
    onPieceSelected: (piece: PieceType, square: SquareType) => void,
    onInviteFriend: () => void,
    onJoinFriend: (roomId: string) => void,
    onPlayWithComputer: () => void
    gameTime: number,
    numberOfCards: number,
    setGameInfo: (gameTime: number, numberOfCards: number) => void,
    onNavigateBack: () => void,
    onNavigateForward: () => void,
    ryujinService: InterpreterFrom<typeof ryujinMachine>
} & Partial<GameContext>

const PlayContext = createContext({} as PlayValues);

export default function PlayContextProvider({ children }: { children: ReactNode }) {
    const ryujinService = useInterpret(ryujinMachine)
    const { send } = ryujinService
    const [time, setTime] = useState(480000)
    const [numberOfCards, setNumberOfCards] = useState(16)
    const [playingMode, setPlayingMode] = useState<0 | 1 | 2>(0)
    const gameInfo = { time, numberOfCards }
    const [gameContext, setGameContext] = useState<GameContext | null>(null)

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

    function onPlayWithComputer() {
        setPlayingMode(2)
        send({ type: "PLAY_OFFLINE" })
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
            onPlayWithComputer,
            ...gameContext
        }}>
            {playingMode === 0 && (
                children
            )}
            {playingMode === 1 && (
                <PlayOnline ryujinService={ryujinService} gameInfo={gameInfo} setContext={setGameContext} setPlayingMode={setPlayingMode}>
                    {children}
                </PlayOnline>
            )}
            {playingMode === 2 && (
                <PlayWithComputer ryujinService={ryujinService} gameInfo={gameInfo} setContext={setGameContext} setPlayingMode={setPlayingMode}>
                    {children}
                </PlayWithComputer>
            )}
        </PlayContext.Provider>
    );
};

export function usePlay() {
    const ctx = useContext(PlayContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
