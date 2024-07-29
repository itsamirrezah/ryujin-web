import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import ArrowIcon from "../icons/arrow-icon"
import CopyIcon from "../icons/copy"
import SideBarButton from "./side-bar-button"
import styles from "./wait-for-friend.module.css"

export default function WaitForFriend() {
    const { onCancelJoin, ryujinService, isRoomActionInProgress } = usePlay()
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)

    async function onCopyHandler() {
        if (!roomId) return;
        const shareLink = `${import.meta.env.VITE_BASE_URL}/play?join=${roomId}`
        await navigator.clipboard.writeText(shareLink)
    }

    const inviteFriendMsg = roomId ? "Share this link with your friend to start the game." : "Waiting for server response..."

    return (
        <div className={styles.container}>
            {roomId && !isRoomActionInProgress && (
                <button onClick={onCancelJoin} className={styles.backBtn}>
                    <ArrowIcon />
                </button>
            )}
            <SideBarButton
                disabled={!roomId || isRoomActionInProgress}
                onClick={onCopyHandler}
                icon={<CopyIcon />}>
                Copy Link
            </SideBarButton>
            <span>{inviteFriendMsg}</span>
        </div>
    )
}
