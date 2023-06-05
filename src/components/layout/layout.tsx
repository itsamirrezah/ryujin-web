import Header from "../header/header"
import styles from "./layout.module.css"
import { Outlet, useRouter } from "@tanstack/router"
import Footer from "../footer/footer"

export default function Layout() {
    const router = useRouter()

    let pageStyle = ""
    switch (router.state.currentLocation.pathname) {
        case "/":
            pageStyle = styles.home; break;
        case "/play":
            pageStyle = styles.play; break;
    }

    return (
        <div className={`${styles.container} ${pageStyle}`}>
            <Header />
            <main><Outlet /></main>
            <Footer />
        </div>
    )
}
