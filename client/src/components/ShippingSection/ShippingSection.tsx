import styles from './ShippingSection.module.scss'

interface ShippingSectionProps {
  arrivalDate: string
  pickupDate: string
}

export default function ShippingSection({
  arrivalDate,
  pickupDate,
}: ShippingSectionProps) {
  return (
    <div className={styles.shippingSection}>
      <div className={styles.shippingInfo}>
        <span className={styles.freeShipping}>{arrivalDate}</span>
        <span className={styles.pickupInfo}>{pickupDate}</span>
      </div>
      <a href="#" className={styles.mapLink}>
        Ver en el mapa
      </a>
    </div>
  )
}
