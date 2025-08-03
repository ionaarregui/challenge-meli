import styles from './SellerSection.module.scss'

interface SellerSectionProps {
  name: string
  sales: string
  invoiceType: string
}

export default function SellerSection({
  name,
  sales,
  invoiceType,
}: SellerSectionProps) {
  return (
    <div className={styles.sellerSection}>
      <p>
        <span className={styles.sellerLabel}>Vendido por </span>
        <a href="#" className={styles.sellerName}>
          {name}
        </a>
      </p>
      <span className={styles.sellerSales}>+{sales} ventas</span>
      <span className={styles.invoiceType}>{invoiceType}</span>
    </div>
  )
}
