import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BreadcrumbProvider } from '../../contexts/BreadcrumContext'
import { SearchProvider } from '../../contexts/SearchContext'
import Layout from '../../Layout/Layout'
import { buildApiUrl } from '../../common/config'

// Mock de la función buildApiUrl
jest.mock('../../common/config', () => ({
  buildApiUrl: jest.fn(),
}))

// Mock de fetch global
global.fetch = jest.fn()

// Mock de los componentes complejos para simplificar el test
jest.mock('../../components/ProductCard', () => {
  return function MockProductCard({ product }: any) {
    return (
      <div data-testid="product-card" onClick={() => {}}>
        <h3>{product.title}</h3>
        <p>{product.price.amount}</p>
      </div>
    )
  }
})

jest.mock('../../components/ProductDetailCard', () => {
  return function MockProductDetailCard({ product }: any) {
    return (
      <div data-testid="product-detail-card">
        <h2>{product.title}</h2>
        <p>Precio: {product.price.amount}</p>
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

jest.mock('../../components/EmptyResults', () => {
  return function MockEmptyResults({ searchTerm }: any) {
    return (
      <div data-testid="empty-results">
        No se encontraron productos para "{searchTerm}"
      </div>
    )
  }
})

jest.mock('../../components/ProductNotFound', () => {
  return function MockProductNotFound() {
    return <div data-testid="product-not-found">Producto no encontrado</div>
  }
})

// Mock de SearchBar para simular interacciones
jest.mock('../../components/SearchBar', () => {
  return function MockSearchBar() {
    return (
      <div data-testid="search-bar">
        <input
          data-testid="search-input"
          placeholder="Buscar productos..."
          onChange={(e) => {
            // Simular navegación cuando se escribe
            if (e.target.value === 'iPhone') {
              window.history.pushState({}, '', '/items?search=iPhone')
            }
          }}
        />
        <button data-testid="search-button">Buscar</button>
      </div>
    )
  }
})

// Mock de Header para simular navegación
jest.mock('../../components/Header', () => {
  return function MockHeader() {
    return (
      <header data-testid="header">
        <div
          data-testid="logo"
          onClick={() => window.history.pushState({}, '', '/')}
        >
          Mercado Libre
        </div>
        <div data-testid="search-bar-container">
          {/* SearchBar se renderiza aquí */}
        </div>
      </header>
    )
  }
})

// Mock de BreadCrumb
jest.mock('../../components/BreadCrumb', () => {
  return function MockBreadCrumb({ steps }: any) {
    return (
      <nav data-testid="breadcrumb">
        {steps.map((step: string, index: number) => (
          <span key={index} data-testid={`breadcrumb-step-${index}`}>
            {step}
          </span>
        ))}
      </nav>
    )
  }
})

// Mock de Footer
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <BreadcrumbProvider>
        <SearchProvider>{component}</SearchProvider>
      </BreadcrumbProvider>
    </BrowserRouter>
  )
}

describe('App Flow Integration', () => {
  const mockBuildApiUrl = buildApiUrl as jest.MockedFunction<typeof buildApiUrl>
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
    mockBuildApiUrl.mockReturnValue('http://localhost:8080/items?search=test')

    // Limpiar el historial del navegador
    window.history.pushState({}, '', '/')
  })

  it('renderiza la página de inicio correctamente', () => {
    renderWithProviders(<Layout />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('renderiza la estructura básica de la aplicación', () => {
    renderWithProviders(<Layout />)

    // Verificar que se muestran los elementos básicos del layout
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('maneja la navegación básica', () => {
    renderWithProviders(<Layout />)

    const logo = screen.getByTestId('logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveTextContent('Mercado Libre')
  })

  it('mantiene la estructura del layout en todas las páginas', () => {
    renderWithProviders(<Layout />)

    // Verificar que el layout siempre está presente
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})
