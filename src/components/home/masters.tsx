import MasterGreen from "../icons/master-green";
import MasterRed from "../icons/master-red";
import styles from "./masters.module.css"

export default function Masters(){
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
