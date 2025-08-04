import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSearch } from '../contexts/SearchContext'

export function useSearchSync() {
  const [searchParams] = useSearchParams()
  const { setSearchTerm, clearSearch } = useSearch()

  useEffect(() => {
    const searchFromUrl = searchParams.get('search')

    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    } else {
      clearSearch()
    }
  }, [searchParams, setSearchTerm, clearSearch])
}
