import styles from "./h2.module.css"

type H2Props = {
    children: string
}

export default function H2({ children }: H2Props) {
    return <h2 className={styles.h2}>{children}</h2>
}
