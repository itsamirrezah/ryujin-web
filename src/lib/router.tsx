import Layout from "@/components/layout/layout";
import PlayContextProvider, { usePlay } from "./play/play-context";
import HomePage from "@/pages/home";
import PlayPage from "@/pages/play";
import { RootRoute, Router, Route, redirect, useRouter, useLoader } from "@tanstack/react-router";
import axios from "axios";
import { useSelector } from "@xstate/react";
import Lobby from "@/components/play/lobby";
import Cards from "@/components/play/cards";
import { useEffect } from "react";

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const root = new RootRoute({ component: Layout });

const indexRoute = new Route({
    getParentRoute: () => root,
    path: '/',
    component: HomePage
})

const playRoute = new Route({
    getParentRoute: () => root,
    path: '/play',
    component: LobbyPage
})


// const joinGameRoute = new Route({
//     getParentRoute: () => root,
//     path: "/join/$roomId",
//     beforeLoad: async ({ params }) => {
//         const roomId = params.roomId as string
//         if (!roomId) throw redirect({ to: "/play" })
//         try {
//             await axios.get(`${import.meta.env.VITE_SERVER_BASEURL}/play/validate-room/${roomId}`)
//         } catch {
//             throw redirect({ to: "/play" })
//         }
//     },
//     component: ({ useContext }) => {
//         const a = useContext()
//         console.log({ a })
//         return WrappedPlay({ isFriendLobby: true })
//     }
// })

// const playRoomRoute = new Route({
//     getParentRoute: () => playRoute,
//     path: '$roomId'
// })

const rulesRoute = new Route({
    getParentRoute: () => root,
    path: "/rules"
})

const aboutRoute = new Route({
    getParentRoute: () => root,
    path: "/about"
})

const routeTree = root.addChildren([
    indexRoute,
    playRoute,
    // playRoute.addChildren([playRoomRoute]),
    // joinGameRoute,
    rulesRoute,
    aboutRoute
])

export const router = new Router({ routeTree })

function LobbyPage() {
    return <PlayPage sideBar={<Lobby status="default" />} />
}
// function WrappedPlay(props?: { isFriendLobby?: boolean }) {
//     return (
//         <PlayContextProvider>
//             <LobbySwitcher isFriendLobby={props?.isFriendLobby || false} />
//         </PlayContextProvider>
//     )
// }

// function LobbySwitcher({ isFriendLobby }: { isFriendLobby: boolean }) {
//     const { ryujinService } = usePlay()
//     const router = useRouter()
//     const roomInfo = useSelector(ryujinService, (state) => state.context.roomInfo)
//     const isLobby = useSelector(ryujinService, (state) => state.matches('lobby'))
//     const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
//     const isWaitForOpponent = roomInfo?.id && isLobby
//     const isWaitForFriend = isWaitForOpponent && roomInfo.isPrivate
//     const status = isFriendLobby ? "friendtojoin"
//         : isWaitForFriend ? "waitfriend"
//             : isWaitForOpponent ? "waitopponent"
//                 : "default"
//
//     // useEffect(() => {
//     //     if (!isPlaying || !roomInfo?.id) return
//     //     router.navigate({ to: "/play/$roomId", params: { roomId: roomInfo?.id } })
//     // }, [isPlaying])
//
//     const sideBar = !isLobby ? <Cards /> : <Lobby status={status} roomId={roomInfo?.id} />
//     return <PlayPage sideBar={sideBar} />
// }

