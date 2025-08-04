import { useEffect, useState } from 'react'
import type { ProductDetail } from '../types/Product'
import { useBreadcrumb } from '../contexts/BreadcrumContext'
import { productService } from '../services/productService'

export function useProductsDetails(id: string | undefined) {
  const { setBreadcrumb } = useBreadcrumb()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setProduct(null)
      return
    }

    setLoading(true)
    setError(null)

    productService
      .getProductDetail(id)
      .then((data) => {
        if (data) {
          setBreadcrumb(data.item.categories || [])
          setProduct(data)
        } else {
          setProduct(null)
        }
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [id, setBreadcrumb])

  return { product, loading, error }
}
