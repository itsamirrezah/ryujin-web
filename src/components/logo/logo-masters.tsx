import MasterGreen from "./master-green";
import MasterRed from "./master-red";
import styles from "./logo-masters.module.css"

export default function LogoMasters(){
    return (
            <div className={styles.container}>
                <div className={styles.left}>
                    <MasterRed/>
                </div>
                <div className={styles.right}>
                    <MasterGreen/>
                </div>
            </div>
    )
}
