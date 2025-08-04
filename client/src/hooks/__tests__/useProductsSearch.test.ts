import { renderHook, waitFor } from '@testing-library/react'
import { useBreadcrumb } from '../../contexts/BreadcrumContext'
import { useProductsSearch } from '../useProductsSearch'
import { buildApiUrl } from '../../common/config'

// Mock del contexto BreadcrumbContext
jest.mock('../../contexts/BreadcrumContext', () => ({
  useBreadcrumb: jest.fn(),
}))

// Mock de la función buildApiUrl
jest.mock('../../common/config', () => ({
  buildApiUrl: jest.fn(),
}))

// Mock de fetch global
global.fetch = jest.fn()

describe('useProductsSearch', () => {
  const mockSetBreadcrumb = jest.fn()
  const mockUseBreadcrumb = useBreadcrumb as jest.MockedFunction<
    typeof useBreadcrumb
  >
  const mockBuildApiUrl = buildApiUrl as jest.MockedFunction<typeof buildApiUrl>
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseBreadcrumb.mockReturnValue({
      breadcrumb: [],
      setBreadcrumb: mockSetBreadcrumb,
    })
    mockBuildApiUrl.mockReturnValue('http://localhost:8080/items?search=test')
  })

  it('inicializa con estado por defecto', () => {
    const { result } = renderHook(() => useProductsSearch(''))

    expect(result.current.products).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('limpia productos cuando search está vacío', () => {
    const { result } = renderHook(() => useProductsSearch(''))

    expect(result.current.products).toEqual([])
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('realiza búsqueda cuando search tiene valor', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'iPhone',
        price: { currency: 'ARS', amount: 1000, decimals: 2 },
      },
    ]
    const mockResponse = {
      items: mockProducts,
      categories: ['Electrónicos', 'Celulares'],
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result } = renderHook(() => useProductsSearch('iPhone'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockProducts)
    expect(result.current.error).toBe(null)
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([
      'Electrónicos',
      'Celulares',
    ])
    expect(mockBuildApiUrl).toHaveBeenCalledWith('/items', { search: 'iPhone' })
  })

  it('maneja respuesta 404 correctamente', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 404,
      ok: false,
    } as Response)

    const { result } = renderHook(() =>
      useProductsSearch('producto-inexistente')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBe(null)
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([])
  })

  it('maneja errores de red', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Error de red'))

    const { result } = renderHook(() => useProductsSearch('iPhone'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBe('Error de red')
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([])
  })

  it('maneja errores HTTP', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    const { result } = renderHook(() => useProductsSearch('iPhone'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBe('Error al obtener productos')
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([])
  })

  it('actualiza breadcrumb con categorías vacías cuando no hay datos', async () => {
    const mockResponse = {
      items: [],
      categories: [],
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result } = renderHook(() =>
      useProductsSearch('búsqueda-sin-resultados')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([])
  })

  it('maneja respuesta sin categorías', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'Producto',
        price: { currency: 'ARS', amount: 1000, decimals: 2 },
      },
    ]
    const mockResponse = {
      items: mockProducts,
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result } = renderHook(() => useProductsSearch('producto'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockProducts)
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([])
  })

  it('reacciona a cambios en el parámetro search', async () => {
    const mockProducts1 = [
      {
        id: '1',
        title: 'iPhone',
        price: { currency: 'ARS', amount: 1000, decimals: 2 },
      },
    ]
    const mockProducts2 = [
      {
        id: '2',
        title: 'Samsung',
        price: { currency: 'ARS', amount: 800, decimals: 2 },
      },
    ]

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: mockProducts1,
          categories: ['Electrónicos'],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockProducts2, categories: ['Celulares'] }),
      } as Response)

    const { result, rerender } = renderHook(
      ({ search }) => useProductsSearch(search),
      {
        initialProps: { search: 'iPhone' },
      }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockProducts1)

    // Cambiar el término de búsqueda
    rerender({ search: 'Samsung' })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockProducts2)
    expect(mockBuildApiUrl).toHaveBeenCalledWith('/items', {
      search: 'Samsung',
    })
  })

  it('maneja términos de búsqueda con caracteres especiales', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'iPhone 14 Pro Max',
        price: { currency: 'ARS', amount: 1000, decimals: 2 },
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: mockProducts, categories: ['Electrónicos'] }),
    } as Response)

    renderHook(() => useProductsSearch('iPhone 14 Pro Max'))

    expect(mockBuildApiUrl).toHaveBeenCalledWith('/items', {
      search: 'iPhone 14 Pro Max',
    })
  })
})
