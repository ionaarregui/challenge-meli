import { useState } from 'react'
import styles from './FavoriteButton.module.scss'

export default function FavoriteButton() {
  const [active, setActive] = useState(false)
  
  const handleClick = () => {
    // TODO: Agregar logica para agregar o quitar el producto de favoritos
    setActive(!active)
  }
  
  return (
    <button 
      onClick={handleClick}
      className={styles.favoriteButton}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.heartIcon} ${active ? styles.active : ''}`}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={active ? "#3483fa" : "none"}
          stroke={active ? "none" : "#3483fa"}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
