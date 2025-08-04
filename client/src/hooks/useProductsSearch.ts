import { useEffect, useState } from 'react'
import type { Product } from '../types/Product'
import { useBreadcrumb } from '../contexts/BreadcrumContext'
import { productService } from '../services/productService'

export function useProductsSearch(search: string) {
  const { setBreadcrumb } = useBreadcrumb()
  const [products, setProducts] = useState<Product[] | []>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!search) {
      setProducts([])
      return
    }

    setLoading(true)
    setError(null)

    productService
      .searchProducts(search)
      .then((data) => {
        setBreadcrumb(data.categories)
        setProducts(data.items)
      })
      .catch((err) => {
        setBreadcrumb([])
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [search, setBreadcrumb])

  return { products, loading, error }
}
