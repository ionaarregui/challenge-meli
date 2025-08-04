import React from 'react'
import { render, screen } from '@testing-library/react'
import Rating from '../Rating'

describe('Rating Component', () => {
  it('renderiza correctamente con rating entero', () => {
    render(<Rating rating={4} />)

    expect(screen.getByText('4.0')).toBeInTheDocument()
  })

  it('renderiza correctamente con rating decimal', () => {
    render(<Rating rating={4.5} />)

    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('renderiza 5 estrellas siempre', () => {
    render(<Rating rating={3} />)

    const starsContainer = screen.getByText('3.0').nextElementSibling
    expect(starsContainer?.children).toHaveLength(5)
  })

  it('renderiza el número total de reviews cuando se proporciona', () => {
    render(<Rating rating={4.2} totalReviews={128} />)

    expect(screen.getByText('(128)')).toBeInTheDocument()
  })

  it('no renderiza el número de reviews cuando no se proporciona', () => {
    render(<Rating rating={4.2} />)

    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument()
  })

  it('no muestra el score cuando showScore es false', () => {
    render(<Rating rating={4.2} showScore={false} />)

    expect(screen.queryByText('4.2')).not.toBeInTheDocument()
  })

  it('muestra el score por defecto', () => {
    render(<Rating rating={4.2} />)

    expect(screen.getByText('4.2')).toBeInTheDocument()
  })

  it('maneja rating de 0 correctamente', () => {
    render(<Rating rating={0} />)

    expect(screen.getByText('0.0')).toBeInTheDocument()
  })

  it('maneja rating de 5 correctamente', () => {
    render(<Rating rating={5} />)

    expect(screen.getByText('5.0')).toBeInTheDocument()
  })

  it('maneja rating con muchos decimales', () => {
    render(<Rating rating={3.789} />)

    expect(screen.getByText('3.8')).toBeInTheDocument()
  })

  it('tiene la estructura DOM correcta', () => {
    render(<Rating rating={4} totalReviews={100} />)

    const container = screen.getByText('4.0').closest('div')
    expect(container).toHaveClass('ratingContainer')

    const starsContainer = container?.querySelector('.starsContainer')
    expect(starsContainer).toBeInTheDocument()
  })

  it('renderiza correctamente con todas las props', () => {
    render(<Rating rating={4.5} totalReviews={256} showScore={true} />)

    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(256)')).toBeInTheDocument()
  })

  it('renderiza correctamente sin mostrar score pero con reviews', () => {
    render(<Rating rating={4.5} totalReviews={256} showScore={false} />)

    expect(screen.queryByText('4.5')).not.toBeInTheDocument()
    expect(screen.getByText('(256)')).toBeInTheDocument()
  })
})
