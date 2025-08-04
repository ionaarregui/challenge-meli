import { useState, useEffect } from 'react'
import { useSearch } from '../../contexts/SearchContext'
import { useSearchSync } from '../../hooks/useSearchSync'
import styles from './SearchBar.module.scss'
import SearchButton from './SearchButton'

export default function SearchBar() {
  const { searchTerm, performSearch } = useSearch()
  const [query, setQuery] = useState<string>(searchTerm)

  // Sincronizar con la URL
  useSearchSync()

  // Sincronizar el input cuando cambie el searchTerm del contexto
  useEffect(() => {
    setQuery(searchTerm)
  }, [searchTerm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Buscar productos, marcas y más…"
          aria-label="Ingresá lo que quieras encontrar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="search-input"
        />
        <SearchButton />
      </div>
    </form>
  )
}
