import LogoPrimary from "../icons/logo-primary"
import NavItems from "../navigation/nav-items"
import styles from "./header.module.css"


export default function Header(){

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
            <div className={styles.user}>User-Profile</div>
        </header>
    )
}
