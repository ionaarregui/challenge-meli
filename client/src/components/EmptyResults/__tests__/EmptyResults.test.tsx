import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import EmptyResults from '../EmptyResults'

// Mock del componente Error
jest.mock('../../Error', () => ({
  Error: function MockError(props: any) {
    return (
      <div data-testid="error-component">
        <h2>{props.title}</h2>
        <p>{props.message}</p>
        <button onClick={props.actionButton?.onClick}>
          {props.actionButton?.label}
        </button>
      </div>
    )
  },
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('EmptyResults Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza con el título por defecto cuando no hay searchTerm', () => {
    renderWithRouter(<EmptyResults />)

    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument()
  })

  it('renderiza con el título personalizado cuando hay searchTerm', () => {
    renderWithRouter(<EmptyResults searchTerm="iPhone" />)

    expect(
      screen.getByText('No se encontraron productos para "iPhone"')
    ).toBeInTheDocument()
  })

  it('renderiza el mensaje correcto', () => {
    renderWithRouter(<EmptyResults />)

    expect(
      screen.getByText(
        'Intenta con otros términos de búsqueda o revisa la ortografía.'
      )
    ).toBeInTheDocument()
  })

  it('muestra "Volver a la página de inicio" cuando no hay estado de navegación', () => {
    renderWithRouter(<EmptyResults />)

    expect(
      screen.getByRole('button', { name: 'Volver a la página de inicio' })
    ).toBeInTheDocument()
  })

  it('navega al inicio cuando se hace click en el botón sin estado previo', () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    renderWithRouter(<EmptyResults />)

    const button = screen.getByRole('button', {
      name: 'Volver a la página de inicio',
    })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('muestra "Volver a la búsqueda" cuando hay estado de navegación', () => {
    const mockLocation = {
      pathname: '/items',
      search: '?search=test',
      state: { from: '/items?search=test' },
    }
    jest
      .spyOn(require('react-router-dom'), 'useLocation')
      .mockReturnValue(mockLocation)

    renderWithRouter(<EmptyResults />)

    expect(
      screen.getByRole('button', { name: 'Volver a la búsqueda' })
    ).toBeInTheDocument()
  })

  it('navega hacia atrás cuando hay estado previo', () => {
    const mockNavigate = jest.fn()
    const mockLocation = {
      pathname: '/items',
      search: '?search=test',
      state: { from: '/items?search=test' },
    }

    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)
    jest
      .spyOn(require('react-router-dom'), 'useLocation')
      .mockReturnValue(mockLocation)

    renderWithRouter(<EmptyResults />)

    const button = screen.getByRole('button', { name: 'Volver a la búsqueda' })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('pasa las props correctas al componente Error', () => {
    renderWithRouter(<EmptyResults searchTerm="test" />)

    const errorComponent = screen.getByTestId('error-component')
    expect(errorComponent).toBeInTheDocument()

    expect(
      screen.getByText('No se encontraron productos para "test"')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Intenta con otros términos de búsqueda o revisa la ortografía.'
      )
    ).toBeInTheDocument()
  })

  it('maneja searchTerm con caracteres especiales', () => {
    renderWithRouter(<EmptyResults searchTerm="iPhone 14 Pro Max" />)

    expect(
      screen.getByText('No se encontraron productos para "iPhone 14 Pro Max"')
    ).toBeInTheDocument()
  })

  it('maneja searchTerm vacío', () => {
    renderWithRouter(<EmptyResults searchTerm="" />)

    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument()
  })
})
