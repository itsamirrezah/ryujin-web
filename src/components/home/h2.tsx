import styles from "./h2.module.css"

interface IH2Props{
    children: string
}

export default function H2({children}: IH2Props){
    return <h2 className={styles.h2}>{children}</h2>
}
