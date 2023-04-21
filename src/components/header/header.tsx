import LogoPrimary from "../icons/logo-primary"
import styles from "./header.module.css"

export default function Header(){
    return (
        <div>
            <div className={styles.logo}>
                <LogoPrimary />
            </div>
            <nav>
                <ul>
                    <li>Home</li>
                    <li>Start</li>
                    <li>Rules</li>
                    <li>About</li>
                </ul>
            </nav>
            <div>Profile</div>
        </div>
    )
}
