import Header from "../header/header"
import styles from "./layout.module.css"
import { Outlet, useRouterState } from "@tanstack/react-router"
import Footer from "../footer/footer"

export default function Layout() {
    const state = useRouterState()
    const pathname = state.location.pathname
    const pageStyle = pathname === "/" ? styles.homePage : pathname.startsWith("/play") ? styles.playPage : ""

    return (
        <div className={`${styles.container} ${pageStyle}`}>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
