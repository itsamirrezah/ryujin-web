import { usePlay } from "@/lib/play/play-context"
import { useState } from "react"
import styles from "../../pages/play.module.css"
import ChainIcon from "../icons/chain"
import CopyIcon from "../icons/copy"
import DiceIcon from "../icons/dice"
import RocketIcon from "../icons/rocket"
import SideBarButton from "./side-bar-button"

export default function Lobby({ status, roomId }: { status: "waitopponent" | "waitfriend" | "friendtojoin" | "default", roomId?: string }) {
    const defaultSideBar = status === "default"
    const waitForOpponent = status === "waitopponent"
    const waitForFriend = status === "waitfriend"
    const friendToJoin = status === "friendtojoin"
    const { joinRoom, createRoom } = usePlay()
    const [hasCopyToClipboard, setHasCopyToClipboard] = useState(false)
    const link = `${import.meta.env.VITE_BASE_URL}/join/${roomId}`

    async function onCopyLinkHandler() {
        if (!roomId) return;
        await navigator.clipboard.writeText(link)
        setHasCopyToClipboard(true)
    }
    return (
        <div className={styles.side}>
            <div className={styles.sideoptions}>
                {defaultSideBar && (
                    <>
                        <SideBarButton icon={<DiceIcon />} onClick={() => joinRoom()}>Quick Match</SideBarButton>
                        <SideBarButton icon={<ChainIcon />} onClick={createRoom}>With Friends</SideBarButton>
                    </>
                )}
                {waitForOpponent && <div>waiting for opponent</div>}
                {waitForFriend && (
                    <div style={{ display: "flex", flexDirection: "column", textAlign: "center", rowGap: 8, fontSize: 14, color: "#CCCCCC", fontWeight: 500 }}>
                        <SideBarButton onClick={onCopyLinkHandler} icon={<CopyIcon />}>{!hasCopyToClipboard ? "Copy Link" : "Copied!"}</SideBarButton>
                        <span>{!hasCopyToClipboard ? link : "Share this link with your friend"}</span>
                    </div>
                )}

                {friendToJoin && <SideBarButton icon={<RocketIcon />} onClick={() => joinRoom(roomId)}>Join Game</SideBarButton>}

            </div>
        </div>
    )
}
