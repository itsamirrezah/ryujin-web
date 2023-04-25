import styles from "./home.module.css"
import Masters from "@/components/home/masters"
import RoundButton from "@/components/round-button/round-button"
import Ryujin from "@/components/home/ryujin"
import H2 from "@/components/home/h2"
import AuthModal from "@/components/auth/auth-modal"
import { useState } from "react"

export default function HomePage(){
    const [isAuthModalShown, setAuthModalShown] = useState<boolean>(false);

    function onCloseAuthModalHandler(): void{
        setAuthModalShown(false)
    }

    return (
    <>
        <div className={styles.main}>
            <div className={styles.logo}>
                <Ryujin />
                <H2>Play online and challenge your friends</H2>
            </div>
            <div className={styles.get_started}>
                <Masters />
                <RoundButton onClick={()=> setAuthModalShown(state=> !state)}>Play Now</RoundButton>
            </div>
            </div>
        <div>
            <h1>Section 2</h1>
            {isAuthModalShown && <AuthModal onClose={onCloseAuthModalHandler}/> }
        </div>
    </>
  )
}
