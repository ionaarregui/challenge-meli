import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Error } from '../index'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Error Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza con el título por defecto', () => {
    renderWithRouter(<Error />)

    expect(
      screen.getByText('Ha ocurrido un error inesperado')
    ).toBeInTheDocument()
  })

  it('no renderiza mensaje por defecto cuando no se proporciona', () => {
    renderWithRouter(<Error />)

    expect(
      screen.queryByText('Por favor volvé a intentarlo más tarde')
    ).not.toBeInTheDocument()
  })

  it('renderiza con título personalizado', () => {
    renderWithRouter(<Error title="Error personalizado" />)

    expect(screen.getByText('Error personalizado')).toBeInTheDocument()
  })

  it('renderiza con mensaje personalizado', () => {
    renderWithRouter(<Error message="Mensaje personalizado" />)

    expect(screen.getByText('Mensaje personalizado')).toBeInTheDocument()
  })

  it('renderiza con mensaje por defecto cuando se proporciona explícitamente', () => {
    renderWithRouter(<Error message="Por favor volvé a intentarlo más tarde" />)

    expect(
      screen.getByText('Por favor volvé a intentarlo más tarde')
    ).toBeInTheDocument()
  })

  it('renderiza el botón "Ir al inicio" por defecto', () => {
    renderWithRouter(<Error />)

    expect(
      screen.getByRole('button', { name: 'Ir al inicio' })
    ).toBeInTheDocument()
  })

  it('navega al inicio cuando se hace click en el botón por defecto', () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    renderWithRouter(<Error />)

    const button = screen.getByRole('button', { name: 'Ir al inicio' })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('renderiza botón de acción personalizado cuando se proporciona', () => {
    const mockAction = jest.fn()
    const actionButton = {
      label: 'Reintentar',
      onClick: mockAction,
    }

    renderWithRouter(<Error actionButton={actionButton} />)

    expect(
      screen.getByRole('button', { name: 'Reintentar' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Ir al inicio' })
    ).not.toBeInTheDocument()
  })

  it('ejecuta la función onClick del botón personalizado', () => {
    const mockAction = jest.fn()
    const actionButton = {
      label: 'Reintentar',
      onClick: mockAction,
    }

    renderWithRouter(<Error actionButton={actionButton} />)

    const button = screen.getByRole('button', { name: 'Reintentar' })
    fireEvent.click(button)

    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('no renderiza mensaje cuando message es undefined', () => {
    renderWithRouter(<Error message={undefined} />)

    expect(
      screen.queryByText('Por favor volvé a intentarlo más tarde')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('undefined')).not.toBeInTheDocument()
  })

  it('renderiza correctamente con todas las props personalizadas', () => {
    const mockAction = jest.fn()
    const actionButton = {
      label: 'Volver',
      onClick: mockAction,
    }

    renderWithRouter(
      <Error
        title="Error de conexión"
        message="No se pudo conectar al servidor"
        actionButton={actionButton}
      />
    )

    expect(screen.getByText('Error de conexión')).toBeInTheDocument()
    expect(
      screen.getByText('No se pudo conectar al servidor')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument()
  })

  it('mantiene la estructura DOM correcta', () => {
    renderWithRouter(<Error />)

    const container = screen
      .getByText('Ha ocurrido un error inesperado')
      .closest('div')
    expect(container).toHaveClass('container')
  })
})
