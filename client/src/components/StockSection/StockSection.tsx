import styles from './StockSection.module.scss'

interface StockSectionProps {
  available: number
  selected: number
}

export default function StockSection({
  available,
  selected,
}: StockSectionProps) {
  return (
    <div className={styles.stockSection}>
      <span className={styles.stockLabel}>Stock disponible</span>
      <div className={styles.quantitySection}>
        <span className={styles.quantity}>
          Cantidad: {selected} unidad
          <span className={styles.dropdown}>▼</span>
        </span>
        <span className={styles.available}>({available} disponibles)</span>
      </div>
    </div>
  )
}
