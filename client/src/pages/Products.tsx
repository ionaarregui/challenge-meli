import { useSearchParams } from 'react-router-dom'
import { useProductsSearch } from '../hooks/useProductsSearch'

import Spinner from '../components/Spinner'
import ProductCard from '../components/ProductCard'
import { Error } from '../components/Error'
import EmptyResults from '../components/EmptyResults'

export default function Products() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search')?.toLowerCase() || ''
  const { products, loading, error } = useProductsSearch(search)

  if (loading) return <Spinner />
  if (error) return <Error />

  if (products?.length === 0) return <EmptyResults searchTerm={search} />

  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}
