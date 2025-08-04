import { useNavigate } from 'react-router-dom'
import styles from './Header.module.scss'
import SearchBar from '../SearchBar'

export default function Header() {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <nav className={styles.navLogo} onClick={handleLogoClick}>
          mercado libre
        </nav>
        <SearchBar />
      </div>
    </header>
  )
}
