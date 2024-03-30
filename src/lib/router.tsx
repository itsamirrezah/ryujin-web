import Layout from "@/components/layout/layout";
import PlayContextProvider from "./play/play-context";
import HomePage from "@/pages/home";
import PlayPage from "@/pages/play";
import { redirect, createRoute, createRootRoute, createRouter } from "@tanstack/react-router";
import axios from "axios";
import { z } from "zod";

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const root = createRootRoute({ component: Layout });

const indexRoute = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: HomePage
})

const joinSearchSchema = z.object({
    join: z.string().optional()
})

export const playRoute = createRoute({
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
            throw redirect({ to: "/play" })
        }
    },
    component: () => <PlayContextProvider><PlayPage /></PlayContextProvider>
})

const playRoomRoute = createRoute({
    getParentRoute: () => playRoute,
    path: '$gameId'
})

const routeTree = root.addChildren([
    indexRoute,
    playRoute.addChildren([playRoomRoute]),
])

export const router = createRouter({ routeTree })
