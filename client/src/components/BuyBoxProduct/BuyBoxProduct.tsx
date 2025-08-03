import AmountLabel from '../AmountLabel'
import Badge from '../Badge'
import Button from '../Button'
import SellerSection from '../SellerSection'
import ShippingSection from '../ShippingSection'
import StockSection from '../StockSection'
import type { Author, ProductItem } from '../../types/Product'
import styles from './BuyBoxProduct.module.scss'

interface BuyBoxProductProps {
  product: ProductItem
  author: Author
}

export default function BuyBoxProduct({ product, author }: BuyBoxProductProps) {
  return (
    <div className={styles.container}>
      {product.bestPrice && (
        <Badge
          variant="secondary"
          color="default"
          size="small"
          className={styles.badge}
        >
          Mejor precio
        </Badge>
      )}

      <div className={styles.priceSection}>
        <AmountLabel
          {...product.price}
          style={{ fontSize: '22px', fontWeight: 600 }}
          showNotTax={true}
        />
      </div>

      <ShippingSection
        free={product.free_shipping}
        arrivalDate={product.free_shipping ? 'llega gratis mañana' : ''}
        pickupDate={product.retiro || ''}
        pickupLocation="correo y otros puntos"
      />

      <StockSection available={product.stock} selected={1} />

      <div className={styles.actionButtons}>
        <Button variant="primary">Comprar ahora</Button>
        <Button variant="secondary">Agregar al carrito</Button>
      </div>

      <SellerSection
        name={author.userName}
        sales={author.sold_quantity}
        invoiceType="Hace Factura A"
      />
    </div>
  )
}
