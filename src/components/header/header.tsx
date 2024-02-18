import { useAuthContext } from "@/lib/auth"
import useOutsideClick from "@/lib/use-outside-click"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import Hamburger from "../icons/hamburger"
import LogoPrimary from "../icons/logo-primary"
import styles from "./header.module.css"


const navItems = [
    { title: "Home", to: "/" },
    { title: "Play", to: "/play" },
    { title: "Rules", to: "/rules" },
    { title: "About", to: "/about" }
] as const

export default function Header() {
    const { isAuth, onLogout } = useAuthContext()
    const [isNavOpen, setNavOpen] = useState(false)
    const outsideRef = useOutsideClick(() => setNavOpen(false))

    return (
        <header className={styles.container}>
            <Link to="/" className={styles.logo}>
                <LogoPrimary />
            </Link>
            <button className={styles.hamburger} onClick={() => setNavOpen(state => !state)}>
                <Hamburger />
            </button>
            <nav ref={outsideRef} className={`${styles.navigation} ${isNavOpen ? styles.navopen : ""}`}>
                <ul>
                    {navItems.map(item => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                activeProps={{ className: styles.active }}
                                className={styles.item}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            {isAuth && (<div className={styles.user}><button onClick={onLogout}>Logout</button></div>)}
        </header>
    )
}
