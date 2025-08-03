import styles from './SearchBar.module.scss'
import searchIcon from '../../assets/search.svg'

export default function SearchButton() {
  return (
    <div className={styles.searchIconContainer}>
      <button type="submit" aria-label="Buscar" className={styles.searchButton}>
        <img src={searchIcon} alt="" />
      </button>
    </div>
  )
}
