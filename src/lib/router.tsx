import Layout from "@/components/layout/layout";
import PlayContextProvider, { usePlay } from "./play/play-context";
import HomePage from "@/pages/home";
import PlayPage from "@/pages/play";
import { Router, Route, RootRoute, redirect, useSearch } from "@tanstack/react-router";
import axios from "axios";
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
    validateSearch: (search: Record<string, unknown>) => {
        if (search.join) return { join: search.join as string || "" }
        return {}
    },
    beforeLoad: async ({ search }) => {
        const { join } = search
        if (!join) return;
        try {
            await axios.get(`${import.meta.env.VITE_SERVER_BASEURL}/play/validate-room/${join}`)
            return;
        } catch {
            throw redirect({ to: "/play", search: {} })
        }
    },
    component: () => <PlayContextProvider><WrappedPlay /></PlayContextProvider>
})

const playRoomRoute = new Route({
    getParentRoute: () => playRoute,
    path: '$gameId'
})

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
    playRoute.addChildren([playRoomRoute]),
    rulesRoute, aboutRoute
])

export const router = new Router({ routeTree })

function WrappedPlay() {
    const { join } = useSearch({ from: playRoute.fullPath })
    const { onJoinFriend } = usePlay()

    useEffect(() => {
        if (!join) return;
        onJoinFriend(join)
    }, [join])

    return <PlayPage />
}
