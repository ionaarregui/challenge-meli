import { useSearchParams } from 'react-router-dom'
import { useProductsSearch } from '../hooks/useProductsSearch'

import Spinner from '../components/Spinner'
import ProductCard from '../components/ProductCard'
import styles from './Products.module.scss'

export default function Products() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search')?.toLowerCase() || ''
  const { products, loading, error } = useProductsSearch(search)

  if (loading) return <Spinner />
  if (error) return <p className={styles.error}>{error}</p>
  return !products || products.length === 0 ? (
    <p>No se encontraron productos</p>
  ) : (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}
