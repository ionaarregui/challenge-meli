import styles from './Error.module.scss'
import { useNavigate } from 'react-router-dom'

interface ErrorProps {
  title?: string
  message?: string
  actionButton?: {
    label: string
    onClick: () => void
  } | null
}

export default function Error({
  title = 'Ha ocurrido un error inesperado',
  message,
  actionButton = null,
}: ErrorProps) {
  const navigate = useNavigate()

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className={styles.container} data-testid="error-component">
      <h2 className={styles.title}>{title}</h2>
      {message && <p className={styles.message}>{message}</p>}
      {actionButton ? (
        <button onClick={actionButton.onClick} className={styles.link}>
          {actionButton.label}
        </button>
      ) : (
        <button onClick={handleHome} className={styles.link}>
          Ir al inicio
        </button>
      )}
    </div>
  )
}
