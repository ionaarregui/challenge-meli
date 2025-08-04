import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button Component', () => {
  const defaultProps = {
    children: 'Test Button',
  }

  it('renderiza correctamente con el texto proporcionado', () => {
    render(<Button {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: 'Test Button' })
    ).toBeInTheDocument()
  })

  it('aplica la variante primary por defecto', () => {
    render(<Button {...defaultProps} />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('primary')
  })

  it('aplica la variante secondary cuando se especifica', () => {
    render(<Button {...defaultProps} variant="secondary" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('secondary')
  })

  it('aplica la variante tertiary cuando se especifica', () => {
    render(<Button {...defaultProps} variant="tertiary" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('tertiary')
  })

  it('maneja el evento onClick correctamente', () => {
    const handleClick = jest.fn()
    render(<Button {...defaultProps} onClick={handleClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('pasa props adicionales al elemento button', () => {
    render(<Button {...defaultProps} disabled data-testid="custom-button" />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-testid', 'custom-button')
  })

  it('renderiza children complejos correctamente', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    )

    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })
})
