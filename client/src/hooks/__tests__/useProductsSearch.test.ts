import { renderHook, waitFor } from '@testing-library/react'
import { useBreadcrumb } from '../../contexts/BreadcrumContext'
import { useProductsSearch } from '../useProductsSearch'
import { productService } from '../../services/productService'

// Mock del contexto BreadcrumbContext
jest.mock('../../contexts/BreadcrumContext', () => ({
  useBreadcrumb: jest.fn(),
}))

// Mock del servicio de productos
jest.mock('../../services/productService', () => ({
  productService: {
    searchProducts: jest.fn(),
  },
}))

describe('useProductsSearch', () => {
  const mockSetBreadcrumb = jest.fn()
  const mockUseBreadcrumb = useBreadcrumb as jest.MockedFunction<
    typeof useBreadcrumb
  >
  const mockProductService = productService as jest.Mocked<
    typeof productService
  >

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseBreadcrumb.mockReturnValue({
      breadcrumb: [],
      setBreadcrumb: mockSetBreadcrumb,
    })
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
    expect(mockProductService.searchProducts).not.toHaveBeenCalled()
  })

  it('realiza búsqueda cuando search tiene valor', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'iPhone',
        price: { currency: 'ARS' as const, amount: 1000, decimals: 2 },
        picture: 'https://example.com/iphone.jpg',
        condition: 'new' as const,
        free_shipping: 'true',
      },
    ]
    const mockResponse = {
      items: mockProducts,
      categories: ['Electrónicos', 'Celulares'],
    }

    mockProductService.searchProducts.mockResolvedValueOnce(mockResponse)

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
    expect(mockProductService.searchProducts).toHaveBeenCalledWith('iPhone')
  })

  it('maneja respuesta 404 correctamente', async () => {
    const mockResponse = { items: [], categories: [] }
    mockProductService.searchProducts.mockResolvedValueOnce(mockResponse)

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
    mockProductService.searchProducts.mockRejectedValueOnce(
      new Error('Error de red')
    )

    const { result } = renderHook(() => useProductsSearch('iPhone'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBe('Error de red')
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([])
  })

  it('maneja errores HTTP', async () => {
    mockProductService.searchProducts.mockRejectedValueOnce(
      new Error('Error al obtener productos')
    )

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

    mockProductService.searchProducts.mockResolvedValueOnce(mockResponse)

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
        price: { currency: 'ARS' as const, amount: 1000, decimals: 2 },
        picture: 'https://example.com/product.jpg',
        condition: 'new' as const,
        free_shipping: 'false',
      },
    ]
    const mockResponse = {
      items: mockProducts,
      categories: [],
    }

    mockProductService.searchProducts.mockResolvedValueOnce(mockResponse)

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
        price: { currency: 'ARS' as const, amount: 1000, decimals: 2 },
        picture: 'https://example.com/iphone.jpg',
        condition: 'new' as const,
        free_shipping: 'true',
      },
    ]
    const mockProducts2 = [
      {
        id: '2',
        title: 'Samsung',
        price: { currency: 'ARS' as const, amount: 800, decimals: 2 },
        picture: 'https://example.com/samsung.jpg',
        condition: 'new' as const,
        free_shipping: 'true',
      },
    ]

    mockProductService.searchProducts
      .mockResolvedValueOnce({
        items: mockProducts1,
        categories: ['Electrónicos'],
      })
      .mockResolvedValueOnce({
        items: mockProducts2,
        categories: ['Celulares'],
      })

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
    expect(mockProductService.searchProducts).toHaveBeenCalledWith('Samsung')
  })

  it('maneja términos de búsqueda con caracteres especiales', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'iPhone 14 Pro Max',
        price: { currency: 'ARS' as const, amount: 1000, decimals: 2 },
        picture: 'https://example.com/iphone.jpg',
        condition: 'new' as const,
        free_shipping: 'true',
      },
    ]

    mockProductService.searchProducts.mockResolvedValueOnce({
      items: mockProducts,
      categories: ['Electrónicos'],
    })

    renderHook(() => useProductsSearch('iPhone 14 Pro Max'))

    expect(mockProductService.searchProducts).toHaveBeenCalledWith(
      'iPhone 14 Pro Max'
    )
  })
})
