import styles from './ShippingSection.module.scss'

interface ShippingSectionProps {
  free: boolean
  arrivalDate: string
  pickupDate: string
  pickupLocation: string
}

export default function ShippingSection({
  free,
  arrivalDate,
  pickupDate,
  pickupLocation,
}: ShippingSectionProps) {
  return (
    <div className={styles.shippingSection}>
      <div className={styles.shippingInfo}>
        <span className={styles.freeShipping}>Llega gratis {arrivalDate}</span>
        <span className={styles.pickupInfo}>
          Retirá gratis {pickupDate} en {pickupLocation}
        </span>
      </div>
      <a href="#" className={styles.mapLink}>
        Ver en el mapa
      </a>
    </div>
  )
}
