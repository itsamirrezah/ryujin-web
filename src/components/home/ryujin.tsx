import LogoPrimary from "../icons/logo-primary"
import LogoSecondary from "../icons/logo-secondary"
import styles from "./ryujin.module.css"

export default function Ryujin(){
    return (
        <div className={styles.container}>
            <div className={styles.primary}>
                <LogoPrimary/>
            </div>
            <div className={styles.secondary}>
                <LogoSecondary/>
            </div>
        </div>
    )
}
