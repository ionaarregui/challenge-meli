import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SearchBar from '../index'
import { SearchProvider } from '../../../contexts/SearchContext'

// Mock del hook useSearchSync
jest.mock('../../../hooks/useSearchSync', () => ({
  useSearchSync: jest.fn(),
}))

// Mock del componente SearchButton
jest.mock('../SearchButton', () => {
  return function MockSearchButton() {
    return (
      <button type="submit" data-testid="search-button">
        Buscar
      </button>
    )
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <SearchProvider>{component}</SearchProvider>
    </BrowserRouter>
  )
}

describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con el placeholder', () => {
    renderWithProviders(<SearchBar />)

    expect(
      screen.getByPlaceholderText('Buscar productos, marcas y más…')
    ).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
  })

  it('tiene el aria-label correcto', () => {
    renderWithProviders(<SearchBar />)

    expect(
      screen.getByLabelText('Ingresá lo que quieras encontrar')
    ).toBeInTheDocument()
  })

  it('maneja el cambio de input correctamente', () => {
    renderWithProviders(<SearchBar />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'iPhone' } })

    expect(input).toHaveValue('iPhone')
  })

  it('maneja el submit del formulario correctamente', async () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    renderWithProviders(<SearchBar />)

    const input = screen.getByRole('textbox')
    const form = screen.getByRole('search')

    fireEvent.change(input, { target: { value: 'iPhone' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/items?search=iPhone')
    })
  })

  it('no realiza búsqueda con término vacío', async () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    renderWithProviders(<SearchBar />)

    const form = screen.getByRole('search')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('no realiza búsqueda con solo espacios en blanco', async () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    renderWithProviders(<SearchBar />)

    const input = screen.getByRole('textbox')
    const form = screen.getByRole('search')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('renderiza el botón de búsqueda', () => {
    renderWithProviders(<SearchBar />)

    expect(screen.getByTestId('search-button')).toBeInTheDocument()
    expect(screen.getByText('Buscar')).toBeInTheDocument()
  })

  it('sincroniza el input con el searchTerm del contexto', () => {
    const mockSearchContext = {
      searchTerm: 'test search',
      performSearch: jest.fn(),
    }

    jest
      .spyOn(require('../../../contexts/SearchContext'), 'useSearch')
      .mockReturnValue(mockSearchContext)

    renderWithProviders(<SearchBar />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test search')
  })
})
