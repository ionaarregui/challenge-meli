import type { ProductItem } from '../../types/Product'
import AmountLabel from '../AmountLabel'
import FavoriteButton from '../FavoriteButton'
import ProductVariants from '../ProductVariants'
import Rating from '../Rating'
import styles from './ProductDetailCard.module.scss'

interface ProductDetailCard {
  product: ProductItem
}

export default function ProductDetailCard({ product }: ProductDetailCard) {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={product.mainPicture} alt="" />
      <div className={styles.productInfo}>
        <div className={styles.header}>
          <span className={styles.status}>
            {product.condition} | {product.sold_quantity} vendidos
          </span>
          <FavoriteButton />
        </div>
        <h1 className={styles.title}>{product.title}</h1>
        <Rating
          rating={product.rating.score}
          totalReviews={product.rating.count}
        />
        <AmountLabel
          {...product.price}
          showNotTax={true}
          style={{ fontSize: '36px', fontWeight: 300 }}
        />

        <p className={styles.paymentLink}>
          <a>Ver los medios de pago</a>
        </p>

        {product.variants.length > 0 &&
          product.variants.map((variant) => (
            <ProductVariants
              key={variant.variant_type}
              productVariant={variant}
            />
          ))}
      </div>
    </div>
  )
}
