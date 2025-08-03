import { useRouteError } from 'react-router-dom'
import styles from './ErrorBoundary.module.scss'

export default function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  return (
    <div className={styles.error}>
      <h2>Ocurrió un error inesperado</h2>
    </div>
  )
}
