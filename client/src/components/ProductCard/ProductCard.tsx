import React from 'react'
import type { Product } from '../../types/Product'
import styles from './ProductCard.module.scss'
import AmountLabel from '../AmountLabel'
import Badge from '../Badge'
import { FREE_SHIPPING_TEXT } from '../../common/constants'
import { useNavigate, useLocation } from 'react-router-dom'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handlerClick = () => {
    navigate(`/items/${product.id}`, {
      state: {
        product,
        from: location.pathname + location.search,
      },
    })
  }

  return (
    <div
      className={styles.card}
      onClick={handlerClick}
      data-testid="product-card"
    >
      <div className={styles.image}>
        <img src={product.picture} alt={product.title} />
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{product.title}</p>
        <AmountLabel {...product.price} />
        {product.free_shipping && (
          <Badge variant="primary" color="success" size="medium">
            {product.free_shipping}
          </Badge>
        )}
      </div>
    </div>
  )
}

export default ProductCard
