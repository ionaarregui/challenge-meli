import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BreadcrumbProvider } from '../../contexts/BreadcrumContext'
import { SearchProvider } from '../../contexts/SearchContext'
import Products from '../../pages/Products'
import { buildApiUrl } from '../../common/config'

// Mock de la función buildApiUrl
jest.mock('../../common/config', () => ({
  buildApiUrl: jest.fn(),
}))

// Mock de fetch global
global.fetch = jest.fn()

// Mock de los componentes hijos para simplificar el test
jest.mock('../../components/ProductCard', () => {
  return function MockProductCard({ product }: any) {
    return (
      <div data-testid="product-card">
        <h3>{product.title}</h3>
        <p>{product.price.amount}</p>
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

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <BreadcrumbProvider>
        <SearchProvider>{component}</SearchProvider>
      </BreadcrumbProvider>
    </BrowserRouter>
  )
}

describe('Products Page Integration', () => {
  const mockBuildApiUrl = buildApiUrl as jest.MockedFunction<typeof buildApiUrl>
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
    mockBuildApiUrl.mockReturnValue('http://localhost:8080/items?search=test')
  })

  it('muestra EmptyResults cuando no hay búsqueda', () => {
    renderWithProviders(<Products />)

    expect(screen.getByTestId('empty-results')).toBeInTheDocument()
    expect(
      screen.getByText('No se encontraron productos para ""')
    ).toBeInTheDocument()
  })

  it('renderiza correctamente sin búsqueda', () => {
    renderWithProviders(<Products />)

    expect(screen.getByTestId('empty-results')).toBeInTheDocument()
  })

  it('maneja respuesta vacía correctamente', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], categories: [] }),
    } as Response)

    renderWithProviders(<Products />)

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('empty-results')).toBeInTheDocument()
  })
})
