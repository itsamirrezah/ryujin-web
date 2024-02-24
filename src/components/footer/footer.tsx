import GithubIcon from "../icons/github-icon"
import styles from "./footer.module.css"

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <small>Ryujin is an open-source multiplayer game. We welcome suggestions and contributions from the community.</small>
            <div>
                <a href="https://github.com/itsamirrezah/ryujin-web" target="_blank" className={styles.link}>
                    <div className={styles.icon}><GithubIcon /></div>
                    Github
                </a>
            </div>
        </footer >
    )
}
