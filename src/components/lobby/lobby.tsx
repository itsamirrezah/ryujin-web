import { usePlay } from "@/lib/play/play-context";
import { useSelector } from "@xstate/react";
import ChainIcon from "../icons/chain";
import DiceIcon from "../icons/dice";
import SideBarButton from "./side-bar-button";
import styles from "./lobby.module.css"
import RocketIcon from "../icons/rocket";
import WaitForOpponent from "./wait-for-opponent";
import { useAuthContext } from "@/lib/auth";
import ArrowIcon from "../icons/arrow-icon";
import { useEffect, useState } from "react";
import StopwatchIcon from "../icons/stopwatch";
import DiamondIcon from "../icons/diamond";
import RobotIcon from "../icons/robot";
import WaitForFriend from "./wait-for-friend";

const timeControlOptions = [3, 5, 8];

export default function Lobby() {
    const [isCustomSelected, setCustomSelected] = useState(false)
    const [selectedTimeControl, setSelectedTimeControl] = useState<number>()
    const [selectedNumberOfCard, setSelectedNumberOfCard] = useState<number>()
    const {
        onQuickMatch,
        onInviteFriend,
        ryujinService,
        setGameInfo,
        gameTime,
        numberOfCards,
        isRoomActionInProgress,
        onPlayWithComputer
    } = usePlay()
    const { isAuth, openAuth } = useAuthContext()
    const isIdle = useSelector(ryujinService, (state) => state.matches('lobby.idle'))
    const isWaitForOpponent = useSelector(ryujinService, (state) => state.matches('lobby.waitingForOpponent'))
    const isWaitForRematch = useSelector(ryujinService, (state) => state.matches('lobby.waitingForRematch'))
    const isWaitForFriend = useSelector(ryujinService, (state) => state.matches('lobby.waitingForFriend'))
    const isJoinFriend = useSelector(ryujinService, (state) => state.matches('lobby.friendInJoinLobby'))
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)

    function customSelectedHandler() {
        setCustomSelected(prev => !prev)
    }

    function timeControlHandlerHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedTimeControl(+e.target.value)
    }

    function onCustomSubmitHandler() {
        if (!selectedTimeControl || !selectedNumberOfCard) return;
        setGameInfo(selectedTimeControl * 60 * 1000, selectedNumberOfCard)
        setCustomSelected(false)
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
                                disabled={isRoomActionInProgress}
                                onClick={() => !isAuth ? openAuth() : onQuickMatch()}>
                                Quick Match
                            </SideBarButton>
                            <SideBarButton
                                icon={<ChainIcon />}
                                disabled={isRoomActionInProgress}
                                onClick={() => !isAuth ? openAuth() : onInviteFriend()}>
                                With Friends
                            </SideBarButton>
                            <SideBarButton
                                icon={<RobotIcon />}
                                disabled={isRoomActionInProgress}
                                onClick={onPlayWithComputer}>
                                With Computer
                            </SideBarButton>
                        </>
                    ) : (
                        <div className={styles.customContent}>
                            <fieldset>
                                <legend className={styles.legend}>
                                    <StopwatchIcon />
                                    Time Control
                                </legend>
                                <div className={styles.timeControlGroup} role="radiogroup">
                                    {timeControlOptions.map((value) => (
                                        <label key={value}>
                                            <input
                                                type="radio"
                                                name="time-control"
                                                value={value}
                                                checked={selectedTimeControl === value}
                                                onChange={timeControlHandlerHandler}
                                            />
                                            <span className={styles.timeControlBtn}>{`${value} min`}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend className={styles.legend}>
                                    <DiamondIcon />
                                    Number of Cards
                                </legend>
                                <div className={styles.numberOfCards}>
                                    <label htmlFor="card-number">
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
                                    </label>
                                </div>
                            </fieldset>
                            <SideBarButton
                                onClick={onCustomSubmitHandler}>
                                Submit
                            </SideBarButton>
                        </div>
                    )}
                    <div className={styles.custom}>
                        <button
                            className={`${styles.customBtn} ${isCustomSelected ? styles.isOpen : ""}`}
                            disabled={isRoomActionInProgress}
                            onClick={customSelectedHandler}>
                            <span>Custom</span>
                            <span className={styles.customIcon}>
                                <ArrowIcon />
                            </span>
                        </button>
                    </div>
                </div>
            )}
            {(isWaitForOpponent || isWaitForRematch) && <WaitForOpponent />}
            {isWaitForFriend && <WaitForFriend />}
            {isJoinFriend && (
                <div className={styles.joinFriend}>
                    <SideBarButton
                        icon={<RocketIcon />}
                        disabled={isRoomActionInProgress}
                        onClick={() => !isAuth ? openAuth() : onQuickMatch(roomId)}>
                        Join Game
                    </SideBarButton>
                </div>
            )}
        </div >
    )
}
