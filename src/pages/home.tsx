import LogoMasters from "@/components/logo/logo-masters"
import LogoPrimary from "@/components/logo/logo-primary"
import LogoSecondary from "@/components/logo/logo-secondary"
import RoundButton from "@/components/round-button/round-button"
import styles from "./home.module.css"

export default function HomePage(){
  return (
    <div>
        <div className={styles.main}>
            <div>
                <div style={{width: 400}}>
                    <LogoPrimary/>
                </div>
                <div style={{width: 400, marginTop: -10}}>
                    <LogoSecondary/>
                </div>
            <h3>Play online and challenge your friends</h3>
            </div>
            <div>
                <LogoMasters/>
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
