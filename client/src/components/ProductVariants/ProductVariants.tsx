import { useState } from 'react'
import type { ProductVariant, VariantOption } from '../../types/Product'
import ThumbnailImage from '../ThumbnailImage'
import styles from './ProductVariants.module.scss'

interface ProductVariantsProps {
  productVariant: ProductVariant
}

export default function ProductVariants({
  productVariant,
}: ProductVariantsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    productVariant.variant[0]
  )

  const handleVariantClick = (variant: VariantOption) => {
    setSelectedVariant(variant)
  }

  const variantLabel =
    productVariant.variant_type.charAt(0).toUpperCase() +
    productVariant.variant_type.slice(1)

  return (
    <div className={styles.variantsContainer}>
      <p className={styles.colorLabel}>
        {variantLabel}
        {': '}
        <strong>{selectedVariant.variant_value}</strong>
      </p>
      <div className={styles.variantsImages}>
        {productVariant.variant.map((value) => (
          <div
            key={value.variant_value}
            onClick={() => handleVariantClick(value)}
          >
            <ThumbnailImage
              imageUrl={value.picture}
              alt={`producto ${productVariant.variant_type} ${value.variant_value}`}
              isActive={selectedVariant.variant_value === value.variant_value}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
