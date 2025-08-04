import { useEffect, useState } from 'react'
import type { Product } from '../types/Product'
import { useBreadcrumb } from '../contexts/BreadcrumContext'
import { buildApiUrl } from '../common/config'

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
    fetch(buildApiUrl('/items', { search }))
      .then((res) => {
        if (res.status === 404) {
          setProducts([])
          return null
        }
        if (!res.ok) throw new Error('Error al obtener productos')
        return res.json()
      })
      .then((data) => {
        setBreadcrumb(data?.categories ?? [])
        setProducts(data?.items ?? [])
      })
      .catch((err) => {
        setBreadcrumb([])
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [search])

  return { products, loading, error }
}
