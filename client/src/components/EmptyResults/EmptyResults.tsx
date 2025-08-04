import styles from './EmptyResults.module.scss'
import { Error } from '../Error'
import { useLocation, useNavigate } from 'react-router-dom'

const TEXT_BACK = {
  search: 'Volver a la búsqueda',
  home: 'Volver a la página de inicio',
}

interface EmptyResultsProps {
  searchTerm?: string
}

export default function EmptyResults({ searchTerm }: EmptyResultsProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const titleText =
    searchTerm && searchTerm.trim()
      ? `No se encontraron productos para "${searchTerm}"`
      : 'No se encontraron productos'
  const handleBack = () => {
    if (location.state?.from) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div data-testid="empty-results">
      <Error
        title={titleText}
        message="Intenta con otros términos de búsqueda o revisa la ortografía."
        actionButton={{
          label: location.state?.from ? TEXT_BACK.search : TEXT_BACK.home,
          onClick: handleBack,
        }}
      />
    </div>
  )
}
