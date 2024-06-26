import PlayNowButton from "@/components/home/play-now-button"
import { useAuthContext } from "@/lib/auth"
import { createLazyRoute, useNavigate } from "@tanstack/react-router"
import styles from "./home.module.css"
import MasterRed from "@/components/icons/master-red"
import MasterGreen from "@/components/icons/master-green"

function HomePage() {
    const navigate = useNavigate()
    const { isAuth, openAuth } = useAuthContext()

    return (
        <div className={styles.container}>
            <div>
                <div>
                    <div className={styles.masters}>
                        <div className={styles.leftMaster}>
                            <MasterRed />
                        </div>
                        <div className={styles.rightMaster}>
                            <MasterGreen />
                        </div>
                    </div>
                    <h2 className={styles.appTitle}>Ryujin</h2>
                </div>
                <p className={styles.appDescription}>Welcome to the captivating world of Ryujin, a strategic board game that will challenge your tactical prowess and strategic brilliance! Set on a beautifully designed 5x5 board, Ryujin pits two players against each other, each commanding a skilled master and their four devoted students. With every turn, players select cards that dictate the movements of their pieces, offering a seamless blend of strategy and anticipation. Your objective? Either seize your opponent's temple in a thrilling conquest or eliminate all their pieces to claim victory. Ryujin beckons you to unleash your inner martial artist and outmaneuver your adversary in this thrilling game of wits and skill. Are you ready to become a true master of Ryujin?</p>
                <PlayNowButton className={styles.playBtn} onClick={() => !isAuth ? openAuth() : navigate({ to: '/play' })}>
                    Play Now
                </PlayNowButton>
            </div>
        </div>
    )
}

export const Route = createLazyRoute('/')({
    component: HomePage,
})
