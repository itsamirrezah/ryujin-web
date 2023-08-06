import Header from "../header/header"
import styles from "./layout.module.css"
import { Outlet, useRouter } from "@tanstack/router"
import Footer from "../footer/footer"

export default function Layout() {
    const router = useRouter()

    let pageStyle = ""
    const pathname = router.state.currentLocation.pathname
    if (pathname === "/") pageStyle = styles.home
    else if (pathname.startsWith("/play")) pageStyle = styles.play

    return (
        <div className={`${styles.container} ${pageStyle}`}>
            <Header />
            <main><Outlet /></main>
            <Footer />
        </div>
    )
}
