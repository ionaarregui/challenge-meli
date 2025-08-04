import { renderHook, waitFor } from '@testing-library/react'
import { useBreadcrumb } from '../../contexts/BreadcrumContext'
import { useProductsDetails } from '../useProductDetail'
import { productService } from '../../services/productService'

// Mock del contexto BreadcrumbContext
jest.mock('../../contexts/BreadcrumContext', () => ({
  useBreadcrumb: jest.fn(),
}))

// Mock del servicio de productos
jest.mock('../../services/productService', () => ({
  productService: {
    getProductDetail: jest.fn(),
  },
}))

describe('useProductsDetails', () => {
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
    const { result } = renderHook(() => useProductsDetails(undefined))

    expect(result.current.product).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('limpia producto cuando id está vacío', () => {
    const { result } = renderHook(() => useProductsDetails(''))

    expect(result.current.product).toBe(null)
    expect(mockProductService.getProductDetail).not.toHaveBeenCalled()
  })

  it('obtiene detalles del producto cuando id es válido', async () => {
    const mockProductDetail = {
      author: {
        userName: 'test_user',
        name: 'Test',
        lastname: 'User',
        sold_quantity: '100',
      },
      item: {
        id: 'MLA123456789',
        title: 'iPhone 14 Pro Max',
        price: { currency: 'ARS' as const, amount: 1000000, decimals: 2 },
        picture: 'https://example.com/iphone.jpg',
        condition: 'new' as const,
        free_shipping: 'true',
        categories: ['Electrónicos', 'Celulares', 'iPhone'],
        mainPicture: 'https://example.com/iphone-main.jpg',
        variants: [],
        stock: 10,
        sold_quantity: '50',
        rating: { score: 4.5, count: 128 },
        bestPrice: true,
        description: 'Descripción del iPhone',
      },
    }

    mockProductService.getProductDetail.mockResolvedValueOnce(mockProductDetail)

    const { result } = renderHook(() => useProductsDetails('MLA123456789'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toEqual(mockProductDetail)
    expect(result.current.error).toBe(null)
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([
      'Electrónicos',
      'Celulares',
      'iPhone',
    ])
    expect(mockProductService.getProductDetail).toHaveBeenCalledWith(
      'MLA123456789'
    )
  })

  it('maneja respuesta 404 correctamente', async () => {
    mockProductService.getProductDetail.mockResolvedValueOnce(null)

    const { result } = renderHook(() =>
      useProductsDetails('producto-inexistente')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('maneja errores de red', async () => {
    mockProductService.getProductDetail.mockRejectedValueOnce(
      new Error('Error de red')
    )

    const { result } = renderHook(() => useProductsDetails('MLA123456789'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe('Error de red')
  })

  it('maneja errores HTTP', async () => {
    mockProductService.getProductDetail.mockRejectedValueOnce(
      new Error('Error al obtener productos')
    )

    const { result } = renderHook(() => useProductsDetails('MLA123456789'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe('Error al obtener productos')
  })

  it('actualiza breadcrumb con categorías vacías cuando no hay datos', async () => {
    const mockProductDetail = {
      author: {
        userName: 'test_user',
        name: 'Test',
        lastname: 'User',
        sold_quantity: '100',
      },
      item: {
        id: 'MLA123456789',
        title: 'Producto sin categorías',
        price: { currency: 'ARS' as const, amount: 1000, decimals: 2 },
        picture: 'https://example.com/product.jpg',
        condition: 'new' as const,
        free_shipping: 'false',
        categories: [],
        mainPicture: 'https://example.com/product-main.jpg',
        variants: [],
        stock: 5,
        sold_quantity: '10',
        rating: { score: 4.0, count: 50 },
        bestPrice: false,
        description: 'Descripción del producto',
      },
    }

    mockProductService.getProductDetail.mockResolvedValueOnce(mockProductDetail)

    const { result } = renderHook(() => useProductsDetails('MLA123456789'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toEqual(mockProductDetail)
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([])
  })

  it('maneja respuesta sin categorías en el item', async () => {
    const mockProductDetail = {
      author: {
        userName: 'test_user',
        name: 'Test',
        lastname: 'User',
        sold_quantity: '100',
      },
      item: {
        id: 'MLA123456789',
        title: 'Producto sin categorías',
        price: { currency: 'ARS' as const, amount: 1000, decimals: 2 },
        picture: 'https://example.com/product.jpg',
        condition: 'new' as const,
        free_shipping: 'false',
        categories: [],
        mainPicture: 'https://example.com/product-main.jpg',
        variants: [],
        stock: 5,
        sold_quantity: '10',
        rating: { score: 4.0, count: 50 },
        bestPrice: false,
        description: 'Descripción del producto',
      },
    }

    mockProductService.getProductDetail.mockResolvedValueOnce(mockProductDetail)

    const { result } = renderHook(() => useProductsDetails('MLA123456789'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toEqual(mockProductDetail)
    expect(mockSetBreadcrumb).toHaveBeenCalledWith([])
  })

  it('reacciona a cambios en el parámetro id', async () => {
    const mockProduct1 = {
      author: {
        userName: 'user1',
        name: 'User',
        lastname: 'One',
        sold_quantity: '50',
      },
      item: {
        id: 'MLA123456789',
        title: 'iPhone',
        price: { currency: 'ARS' as const, amount: 1000000, decimals: 2 },
        picture: 'https://example.com/iphone.jpg',
        condition: 'new' as const,
        free_shipping: 'true',
        categories: ['Electrónicos'],
        mainPicture: 'https://example.com/iphone-main.jpg',
        variants: [],
        stock: 10,
        sold_quantity: '50',
        rating: { score: 4.5, count: 128 },
        bestPrice: true,
        description: 'iPhone description',
      },
    }

    const mockProduct2 = {
      author: {
        userName: 'user2',
        name: 'User',
        lastname: 'Two',
        sold_quantity: '30',
      },
      item: {
        id: 'MLA987654321',
        title: 'Samsung',
        price: { currency: 'ARS' as const, amount: 800000, decimals: 2 },
        picture: 'https://example.com/samsung.jpg',
        condition: 'new' as const,
        free_shipping: 'true',
        categories: ['Celulares'],
        mainPicture: 'https://example.com/samsung-main.jpg',
        variants: [],
        stock: 5,
        sold_quantity: '30',
        rating: { score: 4.0, count: 80 },
        bestPrice: false,
        description: 'Samsung description',
      },
    }

    mockProductService.getProductDetail
      .mockResolvedValueOnce(mockProduct1)
      .mockResolvedValueOnce(mockProduct2)

    const { result, rerender } = renderHook(
      ({ id }) => useProductsDetails(id),
      {
        initialProps: { id: 'MLA123456789' },
      }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toEqual(mockProduct1)

    // Cambiar el ID del producto
    rerender({ id: 'MLA987654321' })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toEqual(mockProduct2)
    expect(mockProductService.getProductDetail).toHaveBeenCalledWith(
      'MLA987654321'
    )
  })

  it('maneja IDs con caracteres especiales', async () => {
    const mockProductDetail = {
      author: {
        userName: 'test_user',
        name: 'Test',
        lastname: 'User',
        sold_quantity: '100',
      },
      item: {
        id: 'MLA-123-456-789',
        title: 'Producto con ID especial',
        price: { currency: 'ARS' as const, amount: 1000, decimals: 2 },
        picture: 'https://example.com/product.jpg',
        condition: 'new' as const,
        free_shipping: 'false',
        categories: ['Electrónicos'],
        mainPicture: 'https://example.com/product-main.jpg',
        variants: [],
        stock: 5,
        sold_quantity: '10',
        rating: { score: 4.0, count: 50 },
        bestPrice: false,
        description: 'Descripción del producto',
      },
    }

    mockProductService.getProductDetail.mockResolvedValueOnce(mockProductDetail)

    renderHook(() => useProductsDetails('MLA-123-456-789'))

    expect(mockProductService.getProductDetail).toHaveBeenCalledWith(
      'MLA-123-456-789'
    )
  })

  it('maneja respuesta nula', async () => {
    mockProductService.getProductDetail.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useProductsDetails('MLA123456789'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe(null)
  })
})
