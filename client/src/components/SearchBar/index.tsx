import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SearchBar.module.scss'
import SearchButton from './SearchButton'

export default function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/items?search=${query}`)
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
        />
        <SearchButton />
      </div>
    </form>
  )
}
