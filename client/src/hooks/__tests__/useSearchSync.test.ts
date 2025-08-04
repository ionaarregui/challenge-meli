import { renderHook } from '@testing-library/react'
import { useSearchParams } from 'react-router-dom'
import { useSearch } from '../../contexts/SearchContext'
import { useSearchSync } from '../useSearchSync'

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}))

// Mock del contexto SearchContext
jest.mock('../../contexts/SearchContext', () => ({
  useSearch: jest.fn(),
}))

describe('useSearchSync', () => {
  const mockSetSearchTerm = jest.fn()
  const mockClearSearch = jest.fn()
  const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>
  const mockUseSearchParams = useSearchParams as jest.MockedFunction<
    typeof useSearchParams
  >

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSearch.mockReturnValue({
      searchTerm: '',
      setSearchTerm: mockSetSearchTerm,
      clearSearch: mockClearSearch,
      performSearch: jest.fn(),
      isSearching: false,
    })
  })

  it('sincroniza el término de búsqueda cuando hay un parámetro search en la URL', () => {
    const mockSearchParams = new URLSearchParams('?search=iPhone')
    mockUseSearchParams.mockReturnValue([mockSearchParams, jest.fn()])

    renderHook(() => useSearchSync())

    expect(mockSetSearchTerm).toHaveBeenCalledWith('iPhone')
    expect(mockClearSearch).not.toHaveBeenCalled()
  })

  it('limpia la búsqueda cuando no hay parámetro search en la URL', () => {
    const mockSearchParams = new URLSearchParams('')
    mockUseSearchParams.mockReturnValue([mockSearchParams, jest.fn()])

    renderHook(() => useSearchSync())

    expect(mockSetSearchTerm).not.toHaveBeenCalled()
    expect(mockClearSearch).toHaveBeenCalled()
  })

  it('maneja términos de búsqueda con caracteres especiales', () => {
    const mockSearchParams = new URLSearchParams(
      '?search=iPhone%2014%20Pro%20Max'
    )
    mockUseSearchParams.mockReturnValue([mockSearchParams, jest.fn()])

    renderHook(() => useSearchSync())

    expect(mockSetSearchTerm).toHaveBeenCalledWith('iPhone 14 Pro Max')
  })

  it('maneja términos de búsqueda vacíos', () => {
    const mockSearchParams = new URLSearchParams('?search=')
    mockUseSearchParams.mockReturnValue([mockSearchParams, jest.fn()])

    renderHook(() => useSearchSync())

    expect(mockClearSearch).toHaveBeenCalled()
    expect(mockSetSearchTerm).not.toHaveBeenCalled()
  })

  it('reacciona a cambios en los parámetros de búsqueda', () => {
    const mockSearchParams = new URLSearchParams('?search=iPhone')
    mockUseSearchParams.mockReturnValue([mockSearchParams, jest.fn()])

    const { rerender } = renderHook(() => useSearchSync())

    // Cambiar los parámetros de búsqueda
    const newMockSearchParams = new URLSearchParams('?search=Samsung')
    mockUseSearchParams.mockReturnValue([newMockSearchParams, jest.fn()])

    rerender()

    expect(mockSetSearchTerm).toHaveBeenCalledWith('Samsung')
  })

  it('limpia la búsqueda cuando se elimina el parámetro search', () => {
    const mockSearchParams = new URLSearchParams('?search=iPhone')
    mockUseSearchParams.mockReturnValue([mockSearchParams, jest.fn()])

    const { rerender } = renderHook(() => useSearchSync())

    // Eliminar el parámetro search
    const newMockSearchParams = new URLSearchParams('')
    mockUseSearchParams.mockReturnValue([newMockSearchParams, jest.fn()])

    rerender()

    expect(mockClearSearch).toHaveBeenCalled()
  })

  it('maneja múltiples parámetros en la URL', () => {
    const mockSearchParams = new URLSearchParams(
      '?search=iPhone&category=electronics'
    )
    mockUseSearchParams.mockReturnValue([mockSearchParams, jest.fn()])

    renderHook(() => useSearchSync())

    expect(mockSetSearchTerm).toHaveBeenCalledWith('iPhone')
  })
})
