import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface SearchContextType {
  searchTerm: string
  setSearchTerm: (term: string) => void
  clearSearch: () => void
  performSearch: (term: string) => void
  isSearching: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchTerm, setSearchTermState] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTermState('')
    setIsSearching(false)

    if (location.pathname === '/items') {
      navigate('/')
    }
  }, [location.pathname, navigate])

  const performSearch = useCallback(
    (term: string) => {
      const trimmedTerm = term.trim()

      if (!trimmedTerm) {
        clearSearch()
        return
      }

      setSearchTermState(trimmedTerm)
      setIsSearching(true)

      navigate(`/items?search=${encodeURIComponent(trimmedTerm)}`)
    },
    [clearSearch, navigate]
  )

  const value: SearchContextType = {
    searchTerm,
    setSearchTerm,
    clearSearch,
    performSearch,
    isSearching,
  }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
