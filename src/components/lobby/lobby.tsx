import { usePlay } from "@/lib/play/play-context";
import { useSelector } from "@xstate/react";
import ChainIcon from "../icons/chain";
import DiceIcon from "../icons/dice";
import SideBarButton from "./side-bar-button";
import styles from "./lobby.module.css"
import CopyIcon from "../icons/copy";
import RocketIcon from "../icons/rocket";
import WaitForOpponent from "./wait-for-opponent";
import { useAuthContext } from "@/lib/auth";
import ArrowIcon from "../icons/arrow-icon";
import { useEffect, useState } from "react";

export default function Lobby() {
    const [isCustomSelected, setCustomSelected] = useState(false)
    const [selectedTimeControl, setSelectedTimeControl] = useState<number>()
    const [selectedNumberOfCard, setSelectedNumberOfCard] = useState<number>()
    const {
        onQuickMatch,
        onInviteFriend,
        ryujinService,
        onCancelJoin,
        setGameInfo,
        gameTime,
        numberOfCards
    } = usePlay()
    const { isAuth, openAuth } = useAuthContext()
    const isIdle = useSelector(ryujinService, (state) => state.matches('lobby.idle'))
    const isWaitForOpponent = useSelector(ryujinService, (state) => state.matches('lobby.waitingForOpponent'))
    const isWaitForRematch = useSelector(ryujinService, (state) => state.matches('lobby.waitingForRematch'))
    const isWaitForFriend = useSelector(ryujinService, (state) => state.matches('lobby.waitingForFriend'))
    const isJoinFriend = useSelector(ryujinService, (state) => state.matches('lobby.friendInJoinLobby'))
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)

    async function onCopyHandler() {
        if (!roomId) return;
        const shareLink = `${import.meta.env.VITE_BASE_URL}/play?join=${roomId}`
        await navigator.clipboard.writeText(shareLink)
    }

    function customSelectedHandler() {
        setCustomSelected(prev => !prev)
    }

    function timeControlHandlerHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedTimeControl(+e.target.value)
    }

    useEffect(() => {
        setSelectedNumberOfCard(numberOfCards)
        setSelectedTimeControl(Math.floor(gameTime / 1000 / 60))
    }, [numberOfCards, gameTime])

    return (
        <div className={styles.side}>
            {isIdle && (
                <div className={styles.sideActions}>
                    {!isCustomSelected ? (
                        <>
                            <SideBarButton
                                icon={<DiceIcon />}
                                onClick={() => !isAuth ? openAuth() : onQuickMatch()}>
                                Quick Match
                            </SideBarButton>
                            <SideBarButton
                                icon={<ChainIcon />}
                                onClick={() => !isAuth ? openAuth() : onInviteFriend()}>
                                With Friends
                            </SideBarButton>
                        </>
                    ) : (
                        <div>
                            <fieldset>
                                <legend>Time Control: </legend>
                                <div className={styles.timeControl} role="radiogroup">
                                    <label>
                                        <input
                                            type="radio"
                                            name="time-control"
                                            value="3"
                                            checked={selectedTimeControl === 3}
                                            onChange={timeControlHandlerHandler}
                                        />
                                        <span className={styles.timeControlBtn}>3 min</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="time-control"
                                            value="5"
                                            checked={selectedTimeControl === 5}
                                            onChange={timeControlHandlerHandler}
                                        />
                                        <span className={styles.timeControlBtn}>5 min</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="time-control"
                                            value="8"
                                            checked={selectedTimeControl === 8}
                                            onChange={timeControlHandlerHandler}
                                        />
                                        <span className={styles.timeControlBtn}>8 min</span>
                                    </label>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>Select Number of Cards:</legend>
                                <div className={styles.numberOfCards}>
                                    <label htmlFor="card-number">Number of Cards:</label>
                                    <input
                                        onChange={(e) => setSelectedNumberOfCard(+e.target.value)}
                                        type="range"
                                        id="card-number"
                                        name="card-number"
                                        min="5"
                                        max="16"
                                        step="1"
                                        value={selectedNumberOfCard}
                                    />
                                    <output htmlFor="card-number">{selectedNumberOfCard}</output>
                                </div>
                            </fieldset>
                            <SideBarButton icon={<></>}
                                onClick={() => {
                                    if (!selectedTimeControl || !selectedNumberOfCard) return;
                                    setGameInfo(selectedTimeControl * 60 * 1000, selectedNumberOfCard)
                                }}
                            >Submit</SideBarButton>
                        </div>
                    )}
                    <div className={styles.custom}>
                        <button className={styles.customBtn} onClick={customSelectedHandler}>
                            <span>Custom</span>
                            <span className={styles.customIcon}>
                                <ArrowIcon />
                            </span>
                        </button>
                    </div>
                </div>
            )}
            {(isWaitForOpponent || isWaitForRematch) && <WaitForOpponent />}
            {isWaitForFriend && (
                <div className={styles.waitForFriend}>
                    <button onClick={onCancelJoin} className={styles.backBtn}>
                        <ArrowIcon />
                    </button>
                    <SideBarButton onClick={onCopyHandler} icon={<CopyIcon />}>{"Copy Link"}</SideBarButton>
                    <span>Share this link with your friend</span>
                </div>
            )}
            {isJoinFriend && (
                <div className={styles.joinFriend}>
                    <SideBarButton
                        icon={<RocketIcon />}
                        onClick={() => !isAuth ? openAuth() : onQuickMatch(roomId)}>
                        Join Game
                    </SideBarButton>
                </div>
            )}
        </div >
    )
}
