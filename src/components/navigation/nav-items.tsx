import { Link, useRouter } from "@tanstack/react-router"
import styles from "./nav-items.module.css"

const navItems = [
    { title: "Home", to: "/" },
    { title: "Play", to: "/play" },
    { title: "Rules", to: "/rules" },
    { title: "About", to: "/about" }
] as const

export default function NavItems() {
    const router = useRouter()

    return (
        <>
            {navItems.map(item => (
                <li key={item.to}>
                    <Link to={item.to} className={`${styles.item} ${router.state.location.pathname === item.to ? styles.active : ""}`}>{item.title}</Link>
                </li>
            ))}
        </>
    )
}
