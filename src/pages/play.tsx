import Board from "@/components/board/board";
import RoundButton from "@/components/round-button/round-button";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import styles from "./play.module.css";

export default function PlayPage() {
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        socket.on("connect", () => {
            setIsConnected(true);
        })
        socket.on("disconnect", () => {
            setIsConnected(false);
        })
        socket.on("JOIN_ROOM", (data) => {
            console.log("JOIN_ROOM", data);
        })

    }, [])

    function joinRoom() {
        socket.emit("CREATE_OR_JOIN_ROOM");
    }
    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div className={styles.boardlyt}>
                    <Board />
                </div>
                <div className={styles.side}>
                    <RoundButton onClick={joinRoom}>New opponent</RoundButton>
                </div>
            </div>
        </div >
    )
}
