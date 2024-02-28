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
import BackIcon from "../icons/back-icon";

export default function Lobby() {
    const {
        onQuickMatch,
        onInviteFriend,
        ryujinService,
        onCancelJoin
    } = usePlay()
    const { isAuth, openAuth } = useAuthContext()
    const isIdle = useSelector(ryujinService, (state) => state.matches('lobby.idle'))
    const isWaitForOpponent = useSelector(ryujinService, (state) => state.matches('lobby.waitingForOpponent'))
    const isWaitForRematch = useSelector(ryujinService, (state) => state.matches('lobby.waitingForRematch'))
    const isWaitForFriend = useSelector(ryujinService, (state) => state.matches('lobby.waitingForFriend'))
    const isJoinFriend = useSelector(ryujinService, (state) => state.matches('lobby.friendInJoinLobby'))
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)
    const isLobby = isIdle || isWaitForFriend || isWaitForOpponent || isJoinFriend || isWaitForRematch

    if (!isLobby) return null;

    async function onCopyHandler() {
        if (!roomId) return;
        const shareLink = `${import.meta.env.VITE_BASE_URL}/play?join=${roomId}`
        await navigator.clipboard.writeText(shareLink)
    }

    return (
        <div className={styles.side}>
            <div className={styles.sideoptions}>
                {isIdle &&
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
                }
                {(isWaitForOpponent || isWaitForRematch) && <WaitForOpponent />}
                {isWaitForFriend && (
                    <div className={styles.waitforfriend}>
                        <button onClick={onCancelJoin} className={styles.backbtn}>
                            <BackIcon />
                        </button>
                        <SideBarButton onClick={onCopyHandler} icon={<CopyIcon />}>{"Copy Link"}</SideBarButton>
                        <span>Share this link with your friend</span>
                    </div>
                )}
                {isJoinFriend && (
                    <SideBarButton
                        icon={<RocketIcon />}
                        onClick={() => !isAuth ? openAuth() : onQuickMatch(roomId)}>
                        Join Game
                    </SideBarButton>
                )}
            </div>
        </div>)
}
