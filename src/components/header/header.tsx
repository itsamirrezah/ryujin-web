import { useAuthContext } from "@/lib/auth"
import LogoPrimary from "../icons/logo-primary"
import NavItems from "../navigation/nav-items"
import styles from "./header.module.css"


export default function Header() {
    const { isAuth, onLogout } = useAuthContext()

    return (
        <header className={styles.container}>
            <div className={styles.logo}>
                <LogoPrimary />
            </div>
            <nav>
                <ul className={styles.navigation}>
                    <NavItems />
                </ul>
            </nav>
            {isAuth && (<div className={styles.user}><button onClick={onLogout}>Logout</button></div>)}
        </header>
    )
}
