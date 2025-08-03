import { useParams } from 'react-router-dom'
import { useProductsDetails } from '../hooks/useProductDetail'
import Spinner from '../components/Spinner'
import ProductDetailCard from '../components/ProductDetailCard'
import BuyBoxProduct from '../components/BuyBoxProduct'
import styles from './ProductDetail.module.scss'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProductsDetails(id)

  if (loading) return <Spinner />
  if (error) return <p className={styles.error}>{error}</p>

  if (!product) return <h2>Producto no encontrado</h2>

  return (
    <section>
      <div className={styles.container}>
        <div className={styles.productSection}>
          <ProductDetailCard product={product.item} />
        </div>
        <div className={styles.buyBoxSection}>
          <BuyBoxProduct product={product.item} author={product.author} />
        </div>
      </div>

      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>Descripción</h2>
        <div className={styles.descriptionContent}>
          <p>{product.item.description}</p>
        </div>
      </div>
    </section>
  )
}
