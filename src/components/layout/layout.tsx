import Header from "../header/header"
import styles from "./layout.module.css"
import { Outlet } from "@tanstack/router"

export default function Layout(){
    return (
            <div className={`${styles.container} ${styles.home}`}>
                <Header />
                <main><Outlet/></main> 
            </div>
   )
}
