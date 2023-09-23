import PlayNowButton from "@/components/home/play-now-button"
import Masters from "@/components/home/masters"
import { useAuthContext } from "@/lib/auth"
import { useNavigate } from "@tanstack/react-router"
import styles from "./home.module.css"

export default function HomePage() {
    const navigate = useNavigate()
    const { isAuth, openAuth } = useAuthContext()

    return (
        <div className={styles.container}>
            <div>
                <div>
                    <Masters />
                    <h2 className={styles.title}>Ryujin</h2>
                </div>
                <p className={styles.description}>Welcome to the captivating world of Ryujin, a strategic board game that will challenge your tactical prowess and strategic brilliance! Set on a beautifully designed 5x5 board, Ryujin pits two players against each other, each commanding a skilled master and their four devoted students. With every turn, players select cards that dictate the movements of their pieces, offering a seamless blend of strategy and anticipation. Your objective? Either seize your opponent's temple in a thrilling conquest or eliminate all their pieces to claim victory. Ryujin beckons you to unleash your inner martial artist and outmaneuver your adversary in this thrilling game of wits and skill. Are you ready to become a true master of Ryujin?</p>
                <PlayNowButton onClick={() => !isAuth ? openAuth() : navigate({ to: '/play' })}>Play Now</PlayNowButton>
            </div>
        </div>
    )
}
