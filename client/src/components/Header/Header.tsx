import styles from './Header.module.scss'
import SearchBar from '../SearchBar'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <nav className={styles.navLogo}>mercado libre</nav>
        <SearchBar />
      </div>
    </header>
  )
}
