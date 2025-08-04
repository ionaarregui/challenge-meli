import { buildApiUrl } from '../common/config'
import type { ProductsSearchResult, ProductDetail } from '../types/Product'

export const productService = {
  async searchProducts(search: string): Promise<ProductsSearchResult> {
    const response = await fetch(buildApiUrl('/items', { search }))

    if (response.status === 404) {
      return { items: [], categories: [] }
    }

    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }

    return response.json()
  },

  async getProductDetail(id: string): Promise<ProductDetail | null> {
    const response = await fetch(
      buildApiUrl(`/items/${encodeURIComponent(id)}`)
    )

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }

    return response.json()
  },
}
