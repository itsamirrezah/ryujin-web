import Layout from "@/components/layout/layout";
import PlayContextProvider from "./play/play-context";
import HomePage from "@/pages/home";
import PlayPage from "@/pages/play";
import { Router, Route, RootRoute, redirect } from "@tanstack/react-router";
import axios from "axios";
import { z } from "zod";

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

const joinSearchSchema = z.object({
    join: z.string().optional()
})

export const playRoute = new Route({
    getParentRoute: () => root,
    path: '/play',
    validateSearch: (search: Record<string, unknown>) => joinSearchSchema.parse(search),
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
    component: () => <PlayContextProvider><PlayPage /></PlayContextProvider>
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
