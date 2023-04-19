import App from "@/App";
import HomePage from "@/pages/home";
import { RootRoute, Router, Route } from "@tanstack/router";

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}

const root = new RootRoute();

const indexRoute = new Route({
    getParentRoute: ()=> root,
    path: '/',
    component: HomePage
})

const routeTree = root.addChildren([indexRoute])

export const router = new Router({ routeTree })

