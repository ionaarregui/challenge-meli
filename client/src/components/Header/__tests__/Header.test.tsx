import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'
import { SearchProvider } from '../../../contexts/SearchContext'

// Mock del componente SearchBar
jest.mock('../../SearchBar', () => {
  return function MockSearchBar() {
    return <div data-testid="search-bar">Search Bar Component</div>
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <SearchProvider>{component}</SearchProvider>
    </BrowserRouter>
  )
}

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente el header', () => {
    renderWithProviders(<Header />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renderiza el logo con el texto correcto', () => {
    renderWithProviders(<Header />)

    expect(screen.getByText('mercado libre')).toBeInTheDocument()
  })

  it('renderiza el componente SearchBar', () => {
    renderWithProviders(<Header />)

    expect(screen.getByTestId('search-bar')).toBeInTheDocument()
  })

  it('maneja el click en el logo correctamente', () => {
    const mockNavigate = jest.fn()
    const mockClearSearch = jest.fn()

    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)
    jest
      .spyOn(require('../../../contexts/SearchContext'), 'useSearch')
      .mockReturnValue({
        clearSearch: mockClearSearch,
        searchTerm: '',
        setSearchTerm: jest.fn(),
        performSearch: jest.fn(),
        isSearching: false,
      })

    renderWithProviders(<Header />)

    const logo = screen.getByText('mercado libre')
    fireEvent.click(logo)

    expect(mockClearSearch).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('tiene la estructura DOM correcta', () => {
    renderWithProviders(<Header />)

    const header = screen.getByRole('banner')
    expect(header).toHaveClass('header')

    const container = header.querySelector('.headerContainer')
    expect(container).toBeInTheDocument()

    const nav = header.querySelector('.navLogo')
    expect(nav).toBeInTheDocument()
  })

  it('es accesible con roles apropiados', () => {
    renderWithProviders(<Header />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('mantiene la jerarquía de elementos correcta', () => {
    renderWithProviders(<Header />)

    const header = screen.getByRole('banner')
    const container = header.querySelector('.headerContainer') as HTMLElement
    const nav = container?.querySelector('.navLogo') as HTMLElement

    expect(header).toContainElement(container)
    expect(container).toContainElement(nav)
    expect(container).toContainElement(screen.getByTestId('search-bar'))
  })
})
