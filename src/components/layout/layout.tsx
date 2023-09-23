import Header from "../header/header"
import styles from "./layout.module.css"
import { Outlet, useRouter } from "@tanstack/react-router"
import Footer from "../footer/footer"

export default function Layout() {
    const router = useRouter()

    let pageStyle = ""
    const pathname = router.state.location.pathname
    if (pathname === "/") pageStyle = styles.home
    else if (pathname.startsWith("/play") || pathname.startsWith("/join")) pageStyle = styles.play

    return (
        <div className={`${styles.container} ${pageStyle}`}>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
