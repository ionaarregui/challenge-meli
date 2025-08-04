import React from 'react'
import { render, screen } from '@testing-library/react'
import Spinner from '../Spinner'

describe('Spinner Component', () => {
  it('renderiza correctamente el contenedor del spinner', () => {
    render(<Spinner />)

    const container = screen.getByTestId('spinner-container')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('spinnerContainer')
  })

  it('renderiza correctamente el elemento spinner', () => {
    render(<Spinner />)

    const spinner = screen.getByTestId('spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('spinner')
  })

  it('mantiene la estructura DOM correcta', () => {
    render(<Spinner />)

    const container = screen.getByTestId('spinner-container')
    const spinner = screen.getByTestId('spinner')

    expect(container).toContainElement(spinner)
  })

  it('es accesible con roles apropiados', () => {
    render(<Spinner />)

    const container = screen.getByTestId('spinner-container')
    expect(container).toHaveAttribute('role', 'status')
    expect(container).toHaveAttribute('aria-label', 'Cargando...')
  })
})
