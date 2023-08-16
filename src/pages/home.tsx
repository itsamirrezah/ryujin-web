import styles from "./home.module.css"
import Masters from "@/components/home/masters"
import RoundButton from "@/components/round-button/round-button"
import Ryujin from "@/components/home/ryujin"
import H2 from "@/components/home/h2"
import { useAuthContext } from "@/lib/auth"
import { useNavigate } from "@tanstack/router"
import PlayButton from "@/components/buttons/play-button"

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
                    <RoundButton onClick={() => !isAuth ? openAuth() : navigate({ to: '/play' })}>Play Now</RoundButton>
                </div>
            </div>
            <div>
                <h1>Section 2</h1>
            </div>
        </>
    )
}
