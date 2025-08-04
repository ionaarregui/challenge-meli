import { useLocation, useNavigate } from 'react-router-dom'
import { Error } from '../Error'

const TEXT_BACK = {
  search: 'Volver a la búsqueda',
  home: 'Volver a la página de inicio',
}

export default function ProductNotFound() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleBack = () => {
    if (location.state?.from) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div data-testid="product-not-found">
      <Error
        title="Producto no encontrado"
        message="El producto que buscas no existe o ha sido removido."
        actionButton={{
          label: location.state?.from ? TEXT_BACK.search : TEXT_BACK.home,
          onClick: handleBack,
        }}
      />
    </div>
  )
}
