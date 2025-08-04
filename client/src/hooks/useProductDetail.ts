import { useEffect, useState } from 'react'
import type { ProductDetail } from '../types/Product'
import { useBreadcrumb } from '../contexts/BreadcrumContext'
import { buildApiUrl } from '../common/config'

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
    fetch(buildApiUrl(`/items/${encodeURIComponent(id)}`))
      .then((res) => {
        if (res.status === 404) {
          setProduct(null)
          return null
        }
        if (!res.ok) throw new Error('Error al obtener productos')
        return res.json()
      })
      .then((data) => {
        if (data) {
          setBreadcrumb(data.item.categories || [])
          setProduct(data || null)
        }
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading, error }
}
