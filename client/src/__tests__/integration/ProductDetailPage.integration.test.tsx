import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BreadcrumbProvider } from '../../contexts/BreadcrumContext'
import ProductDetail from '../../pages/ProductDetail'
import { buildApiUrl } from '../../common/config'

// Mock de la función buildApiUrl
jest.mock('../../common/config', () => ({
  buildApiUrl: jest.fn(),
}))

// Mock de fetch global
global.fetch = jest.fn()

// Mock de los componentes hijos para simplificar el test
jest.mock('../../components/ProductDetailCard', () => {
  return function MockProductDetailCard({ product }: any) {
    return (
      <div data-testid="product-detail-card">
        <h2>{product.title}</h2>
        <p>Precio: {product.price.amount}</p>
        <p>Condición: {product.condition}</p>
      </div>
    )
  }
})

jest.mock('../../components/BuyBoxProduct', () => {
  return function MockBuyBoxProduct({ product, author }: any) {
    return (
      <div data-testid="buy-box-product">
        <h3>Comprar {product.title}</h3>
        <p>
          Vendedor: {author.name} {author.lastname}
        </p>
      </div>
    )
  }
})

jest.mock('../../components/Spinner', () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Cargando...</div>
  }
})

jest.mock('../../components/Error', () => ({
  Error: function MockError() {
    return <div data-testid="error-component">Error</div>
  },
}))

jest.mock('../../components/ProductNotFound', () => {
  return function MockProductNotFound() {
    return <div data-testid="product-not-found">Producto no encontrado</div>
  }
})

// Mock de useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'MLA123456789' }),
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <BreadcrumbProvider>{component}</BreadcrumbProvider>
    </BrowserRouter>
  )
}

describe('ProductDetail Page Integration', () => {
  const mockBuildApiUrl = buildApiUrl as jest.MockedFunction<typeof buildApiUrl>
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
    mockBuildApiUrl.mockReturnValue('http://localhost:8080/items/MLA123456789')
  })

  it('muestra spinner mientras carga', async () => {
    // Simular una respuesta lenta
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({
                  author: {
                    name: 'Test',
                    lastname: 'User',
                    userName: 'test_user',
                    sold_quantity: '100',
                  },
                  item: {
                    id: 'MLA123456789',
                    title: 'iPhone 14 Pro Max',
                    price: { currency: 'ARS', amount: 1000000, decimals: 2 },
                    picture: 'https://example.com/iphone.jpg',
                    condition: 'new',
                    free_shipping: 'true',
                    categories: ['Electrónicos'],
                    mainPicture: 'https://example.com/iphone-main.jpg',
                    variants: [],
                    stock: 10,
                    sold_quantity: '50',
                    rating: { score: 4.5, count: 128 },
                    bestPrice: true,
                    description: 'Descripción del iPhone',
                  },
                }),
              } as Response),
            100
          )
        )
    )

    renderWithProviders(<ProductDetail />)

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('renderiza detalles del producto cuando la carga es exitosa', async () => {
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
        price: { currency: 'ARS', amount: 1000000, decimals: 2 },
        picture: 'https://example.com/iphone.jpg',
        condition: 'new',
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    renderWithProviders(<ProductDetail />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('product-detail-card')).toBeInTheDocument()
    expect(screen.getByTestId('buy-box-product')).toBeInTheDocument()

    expect(screen.getByText('iPhone 14 Pro Max')).toBeInTheDocument()
    expect(screen.getByText('Precio: 1000000')).toBeInTheDocument()
    expect(screen.getByText('Condición: new')).toBeInTheDocument()
    expect(screen.getByText('Comprar iPhone 14 Pro Max')).toBeInTheDocument()
    expect(screen.getByText('Vendedor: Test User')).toBeInTheDocument()

    // Verificar que se muestra la descripción
    expect(screen.getByText('Descripción')).toBeInTheDocument()
    expect(screen.getByText('Descripción del iPhone')).toBeInTheDocument()

    expect(mockBuildApiUrl).toHaveBeenCalledWith('/items/MLA123456789')
  })

  it('muestra mensaje de error cuando hay un error en la API', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Error de red'))

    renderWithProviders(<ProductDetail />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('error-component')).toBeInTheDocument()
  })

  it('muestra ProductNotFound cuando el producto no existe', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 404,
      ok: false,
    } as Response)

    renderWithProviders(<ProductDetail />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('product-not-found')).toBeInTheDocument()
  })

  it('maneja errores HTTP correctamente', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    renderWithProviders(<ProductDetail />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('error-component')).toBeInTheDocument()
  })

  it('maneja respuesta nula correctamente', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    } as Response)

    renderWithProviders(<ProductDetail />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('product-not-found')).toBeInTheDocument()
  })

  it('renderiza correctamente con producto sin categorías', async () => {
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
        price: { currency: 'ARS', amount: 1000, decimals: 2 },
        picture: 'https://example.com/product.jpg',
        condition: 'new',
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    renderWithProviders(<ProductDetail />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('product-detail-card')).toBeInTheDocument()
    expect(screen.getByTestId('buy-box-product')).toBeInTheDocument()
    expect(screen.getByText('Producto sin categorías')).toBeInTheDocument()
  })
})
