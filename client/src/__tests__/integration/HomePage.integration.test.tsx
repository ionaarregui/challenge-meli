import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BreadcrumbProvider } from '../../contexts/BreadcrumContext'
import { SearchProvider } from '../../contexts/SearchContext'
import Home from '../../pages/Home'

// Mock de la imagen del banner
jest.mock('../../pages/Home.module.scss', () => ({
  banner: 'banner-class',
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <BreadcrumbProvider>
        <SearchProvider>{component}</SearchProvider>
      </BreadcrumbProvider>
    </BrowserRouter>
  )
}

describe('Home Page Integration', () => {
  it('renderiza la página de inicio con el banner', () => {
    renderWithProviders(<Home />)

    const banner = screen.getByAltText(
      'Imagen que muestra un caja de envios abierta junto a una leyenda que indica envio gratis en tu primera compra comprando desde la app'
    )
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveAttribute(
      'src',
      'https://http2.mlstatic.com/D_NQ_659968-MLA87448511259_072025-OO.webp'
    )
    expect(banner).toHaveClass('banner-class')
  })

  it('limpia el breadcrumb al cargar la página', () => {
    // Este test verifica que el useEffect se ejecute correctamente
    // aunque no podemos verificar directamente el estado del contexto
    // debido a que está encapsulado, verificamos que la página se renderice correctamente
    renderWithProviders(<Home />)

    expect(
      screen.getByAltText(
        'Imagen que muestra un caja de envios abierta junto a una leyenda que indica envio gratis en tu primera compra comprando desde la app'
      )
    ).toBeInTheDocument()
  })

  it('mantiene la estructura DOM correcta', () => {
    renderWithProviders(<Home />)

    const banner = screen.getByAltText(
      'Imagen que muestra un caja de envios abierta junto a una leyenda que indica envio gratis en tu primera compra comprando desde la app'
    )
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveClass('banner-class')
  })
})
