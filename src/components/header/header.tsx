import { useAuthContext } from "@/lib/auth"
import useOutsideClick from "@/lib/use-outside-click"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import GithubIcon from "../icons/github-icon"
import HamburgerIcon from "../icons/hamburger"
import LogoPrimary from "../icons/logo-primary"
import LogoutIcon from "../icons/sign-out"
import TriangleExclamationIcon from "../icons/triangle-exclamation"
import styles from "./header.module.css"


const navItems = [
    { title: "Home", to: "/" },
    { title: "Play", to: "/play" },
] as const

export default function Header() {
    const [logout, setLogout] = useState<number>(0)
    const { isAuth, onLogout, openAuth, user, isLogoutEnabled } = useAuthContext()
    const [isNavOpen, setNavOpen] = useState(false)
    const navRef = useOutsideClick(() => setNavOpen(false))
    const logoutRef = useOutsideClick<HTMLButtonElement>(() => setLogout(0))

    function onLogoutHandler() {
        setLogout(prev => {
            if (prev + 1 >= 2) {
                onLogout()
                return 0
            }
            return prev + 1
        })
    }

    return (
        <header className={styles.container}>
            <Link to="/" className={styles.logo}>
                <LogoPrimary />
            </Link>
            <button className={styles.hamburgerMenu} onClick={() => setNavOpen(state => !state)}>
                <HamburgerIcon />
            </button>
            <nav ref={navRef} className={`${styles.navMenu} ${isNavOpen ? styles.navOpen : ""}`}>
                <ul>
                    {navItems.map(item => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                activeProps={{ className: styles.selectedItem }}
                                className={styles.navItem}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className={styles.links}>
                    <a href="https://github.com/itsamirrezah/ryujin-web" target="_blank" className={styles.link}>
                        <div className={styles.icon}><GithubIcon /></div>
                        Github
                    </a>
                </div>
            </nav>
            <div className={styles.userActions}>
                {!isAuth && user && (
                    <button className={styles.action} onClick={openAuth}>
                        <TriangleExclamationIcon />
                    </button>
                )}
                {user && isLogoutEnabled && (
                    <button
                        ref={logoutRef}
                        className={`${styles.action} ${logout === 1 ? styles.selected : ""}`}
                        onClick={onLogoutHandler}>
                        <LogoutIcon />
                    </button>
                )}
            </div>
        </header>
    )
}
