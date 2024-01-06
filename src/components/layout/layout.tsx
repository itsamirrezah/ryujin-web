import Header from "../header/header"
import styles from "./layout.module.css"
import { Outlet, useRouterState } from "@tanstack/react-router"
import Footer from "../footer/footer"

export default function Layout() {
    const state = useRouterState()

    let pageStyle = ""
    const pathname = state.location.pathname
    if (pathname === "/") pageStyle = styles.home
    else if (pathname.startsWith("/play")) pageStyle = styles.play

    return (
        <div className={`${styles.container} ${pageStyle}`}>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
