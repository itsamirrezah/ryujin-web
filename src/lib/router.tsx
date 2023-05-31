import Layout from "@/components/layout/layout";
import HomePage from "@/pages/home";
import PlayPage from "@/pages/play";
import { RootRoute, Router, Route } from "@tanstack/router";

declare module '@tanstack/router' {
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
    component: PlayPage
})

const rulesRoute = new Route({
    getParentRoute: () => root,
    path: "/rules"
})

const aboutRoute = new Route({
    getParentRoute: () => root,
    path: "/about"
})

const routeTree = root.addChildren([indexRoute, playRoute, rulesRoute, aboutRoute])

export const router = new Router({ routeTree })

