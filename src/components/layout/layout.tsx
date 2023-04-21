import { ReactNode } from "react"
import Header from "../header/header"
import styles from "./layout.module.css"

interface ILayoutProps{
    children: ReactNode
}

export default function Layout({children}: ILayoutProps){
    return (
            <div className={`${styles.container} ${styles.home}`}>
                <Header/>
                <main>{children}</main> 
            </div>
   )
}
