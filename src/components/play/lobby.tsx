import { usePlay } from "@/lib/play/play-context";
import { useSelector } from "@xstate/react";
import ChainIcon from "../icons/chain";
import DiceIcon from "../icons/dice";
import SideBarButton from "./side-bar-button";
import styles from "./lobby.module.css"
import CopyIcon from "../icons/copy";
import RocketIcon from "../icons/rocket";

export default function Lobby() {
    const {
        onQuickMatch,
        onInviteFriend,
        ryujinService
    } = usePlay()
    const isIdle = useSelector(ryujinService, (state) => state.matches('lobby.idle'))
    const isWaitForOpponent = useSelector(ryujinService, (state) => state.matches('lobby.waitForOpponent'))
    const isWaitForFriend = useSelector(ryujinService, (state) => state.matches('lobby.waitForFriend'))
    const isJoinFriend = useSelector(ryujinService, (state) => state.matches('lobby.joinFriend'))
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)
    const isLobby = isIdle || isWaitForFriend || isWaitForOpponent || isJoinFriend

    if (!isLobby) return null;

    async function onCopyHandler() {
        if (!roomId) return;
        const shareLink = `${import.meta.env.VITE_BASE_URL}/join/${roomId}`
        await navigator.clipboard.writeText(shareLink)
    }

    return (
        <div className={styles.side}>
            <div className={styles.sideoptions}>
                {isIdle &&
                    <>
                        <SideBarButton icon={<DiceIcon />} onClick={() => onQuickMatch()}>Quick Match</SideBarButton>
                        <SideBarButton icon={<ChainIcon />} onClick={onInviteFriend}>With Friends</SideBarButton>
                    </>
                }
                {isWaitForOpponent && <div>Wait For Opponent </div>}
                {isWaitForFriend && (
                    <div style={{ display: "flex", flexDirection: "column", textAlign: "center", rowGap: 8, fontSize: 14, color: "#CCCCCC", fontWeight: 500 }}>
                        <SideBarButton onClick={onCopyHandler} icon={<CopyIcon />}>{"Copy Link"}</SideBarButton>
                        <span>Share this link with your friend</span>
                    </div>
                )}
                {isJoinFriend && <SideBarButton icon={<RocketIcon />} onClick={() => onQuickMatch(roomId)}>Join Game</SideBarButton>}
            </div>
        </div>)
}
