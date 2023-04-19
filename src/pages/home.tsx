import Masters from "@/components/home/masters"
import RoundButton from "@/components/round-button/round-button"
import styles from "./home.module.css"
import Ryujin from "@/components/home/ryujin"

export default function HomePage(){
  return (
    <div>
        <div className={styles.main}>
            <div>
                <Ryujin />
                <h3>Play online and challenge your friends</h3>
            </div>
            <div>
                <Masters />
                <RoundButton>Sign Up</RoundButton>
                <RoundButton>Login</RoundButton>
            </div>
        </div>
        <div>
            <h1>Section 2</h1>
        </div>
    </div>
  )
}
