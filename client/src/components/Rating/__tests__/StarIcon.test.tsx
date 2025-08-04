import React from 'react'
import { render, screen } from '@testing-library/react'
import StarIcon from '../StarIcon'

describe('StarIcon Component', () => {
  it('renderiza una estrella vacía cuando filled y halfFilled son false', () => {
    render(<StarIcon filled={false} halfFilled={false} />)

    const svg = screen.getByTestId('star-icon')
    expect(svg).toBeInTheDocument()

    const path = svg.querySelector('path')
    expect(path).toHaveAttribute('fill', 'none')
  })

  it('renderiza una estrella llena cuando filled es true', () => {
    render(<StarIcon filled={true} halfFilled={false} />)

    const svg = screen.getByTestId('star-icon')
    const path = svg.querySelector('path')
    expect(path).toHaveAttribute('fill', '#3483fa')
  })

  it('renderiza una estrella media llena cuando halfFilled es true', () => {
    render(<StarIcon filled={false} halfFilled={true} />)

    const svg = screen.getByTestId('star-icon')
    const path = svg.querySelector('path')
    expect(path).toHaveAttribute('fill', 'url(#halfStar)')
  })

  it('prioriza halfFilled sobre filled', () => {
    render(<StarIcon filled={true} halfFilled={true} />)

    const svg = screen.getByTestId('star-icon')
    const path = svg.querySelector('path')
    expect(path).toHaveAttribute('fill', 'url(#halfStar)')
  })

  it('tiene el stroke correcto en todos los casos', () => {
    render(<StarIcon filled={false} halfFilled={false} />)

    const svg = screen.getByTestId('star-icon')
    const path = svg.querySelector('path')
    expect(path).toHaveAttribute('stroke', '#3483fa')
    expect(path).toHaveAttribute('stroke-width', '1.5')
  })

  it('tiene las dimensiones correctas', () => {
    render(<StarIcon filled={false} halfFilled={false} />)

    const svg = screen.getByTestId('star-icon')
    expect(svg).toHaveAttribute('width', '12')
    expect(svg).toHaveAttribute('height', '12')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('incluye el gradiente cuando halfFilled es true', () => {
    render(<StarIcon filled={false} halfFilled={true} />)

    const svg = screen.getByTestId('star-icon')
    const defs = svg.querySelector('defs')
    expect(defs).toBeInTheDocument()

    const linearGradient = defs?.querySelector('linearGradient')
    expect(linearGradient).toHaveAttribute('id', 'halfStar')
  })

  it('no incluye el gradiente cuando halfFilled es false', () => {
    render(<StarIcon filled={false} halfFilled={false} />)

    const svg = screen.getByTestId('star-icon')
    const defs = svg.querySelector('defs')
    expect(defs).not.toBeInTheDocument()
  })

  it('tiene el path correcto en todos los casos', () => {
    render(<StarIcon filled={false} halfFilled={false} />)

    const svg = screen.getByTestId('star-icon')
    const path = svg.querySelector('path')
    expect(path).toHaveAttribute(
      'd',
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    )
  })

  it('tiene el atributo fill="none" en el svg', () => {
    render(<StarIcon filled={false} halfFilled={false} />)

    const svg = screen.getByTestId('star-icon')
    expect(svg).toHaveAttribute('fill', 'none')
  })
})
