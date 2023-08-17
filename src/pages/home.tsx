import PlayButton from "@/components/buttons/play-button"
import H2 from "@/components/home/h2"
import Masters from "@/components/home/masters"
import Ryujin from "@/components/home/ryujin"
import { useAuthContext } from "@/lib/auth"
import { useNavigate } from "@tanstack/router"
import styles from "./home.module.css"

export default function HomePage() {
    const navigate = useNavigate()
    const { isAuth, openAuth } = useAuthContext()

    return (
        <>
            <div className={styles.main}>
                <div className={styles.logo}>
                    <Ryujin />
                    <H2>Play online and challenge your friends</H2>
                </div>
                <div className={styles.get_started}>
                    <Masters />
                    <PlayButton onClick={() => !isAuth ? openAuth() : navigate({ to: '/play' })}>Play Now</PlayButton>
                </div>
            </div>
            <div>
                <h1>Section 2</h1>
            </div>
        </>
    )
}
