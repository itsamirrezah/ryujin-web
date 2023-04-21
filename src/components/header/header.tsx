import LogoPrimary from "../icons/logo-primary"
import styles from "./header.module.css"

export default function Header(){
    return (
        <header className={styles.container}>
            <div className={styles.logo}>
                <LogoPrimary />
            </div>
            <nav>
                <ul className={styles.navigation}>
                    <li>Home</li>
                    <li>Play</li>
                    <li>Rules</li>
                    <li>About</li>
                </ul>
            </nav>
            <div className={styles.user}>User-Profile</div>
        </header>
    )
}
