import { usePlay } from "@/lib/play/play-context";
import { useSelector } from "@xstate/react";
import ChainIcon from "../icons/chain";
import DiceIcon from "../icons/dice";
import SideBarButton from "./side-bar-button";
import styles from "./lobby.module.css"
import CopyIcon from "../icons/copy";

export default function Lobby() {
    const {
        onQuickMatch,
        onInviteFriend,
        ryujinService
    } = usePlay()
    const isIdle = useSelector(ryujinService, (state) => state.matches('lobby.idle'))
    const isWaitForOpponent = useSelector(ryujinService, (state) => state.matches('lobby.waitForOpponent'))
    const isWaitForFriend = useSelector(ryujinService, (state) => state.matches('lobby.waitForFriend'))
    const isLobby = isIdle || isWaitForFriend || isWaitForOpponent


    if (!isLobby) return null;

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
                        <SideBarButton onClick={() => { }} icon={<CopyIcon />}>{"Copy Link"}</SideBarButton>
                        <span>{"Share this link with your friend"}</span>
                    </div>
                )}
            </div>
        </div>)
}
