import { ReactNode } from "react"
import styles from "./layout.module.css"

interface ILayoutProps{
    children: ReactNode
}

export default function Layout({children}: ILayoutProps){
    return (
            <div className={`${styles.container} ${styles.home}`}>
                <main>{children}</main> 
            </div>
   )
}
