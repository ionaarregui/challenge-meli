export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  ENDPOINTS: {
    SEARCH: '/items',
    PRODUCT_DETAIL: '/items/:id',
  },
} as const

export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string>
) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value)
    })
    url += `?${searchParams.toString()}`
  }

  return url
}
