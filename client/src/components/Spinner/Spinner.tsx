import styles from './Spinner.module.scss'

export default function Spinner() {
  return (
    <div
      className={styles.spinnerContainer}
      data-testid="spinner-container"
      role="status"
      aria-label="Cargando..."
    >
      <div className={styles.spinner} data-testid="spinner" />
    </div>
  )
}
