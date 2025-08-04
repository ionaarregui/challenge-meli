import { useParams } from 'react-router-dom'
import { useProductsDetails } from '../hooks/useProductDetail'
import Spinner from '../components/Spinner'
import ProductDetailCard from '../components/ProductDetailCard'
import BuyBoxProduct from '../components/BuyBoxProduct'
import ProductNotFound from '../components/ProductNotFound'
import styles from './ProductDetail.module.scss'
import { Error } from '../components/Error'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProductsDetails(id)

  if (loading) return <Spinner />
  if (error) return <Error />
  if (!product) return <ProductNotFound />

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
