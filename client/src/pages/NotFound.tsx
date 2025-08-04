import { Link } from 'react-router-dom'
import styles from './NotFound.module.scss'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Parece que esta página no existe</h2>
      <Link to="/" className={styles.link}>
        Volver a la página de inicio
      </Link>
    </div>
  )
}
