import React from 'react'
import { render, screen } from '@testing-library/react'
import Badge from '../Badge'

describe('Badge Component', () => {
  const defaultProps = {
    children: 'Test Badge',
  }

  it('renderiza correctamente con el texto proporcionado', () => {
    render(<Badge {...defaultProps} />)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('aplica la variante primary por defecto', () => {
    render(<Badge {...defaultProps} />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('primary')
  })

  it('aplica la variante secondary cuando se especifica', () => {
    render(<Badge {...defaultProps} variant="secondary" />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('secondary')
  })

  it('aplica el color default por defecto', () => {
    render(<Badge {...defaultProps} />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('default')
  })

  it('aplica el color success cuando se especifica', () => {
    render(<Badge {...defaultProps} color="success" />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('success')
  })

  it('aplica el color info cuando se especifica', () => {
    render(<Badge {...defaultProps} color="info" />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('info')
  })

  it('aplica el tamaño medium por defecto', () => {
    render(<Badge {...defaultProps} />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('medium')
  })

  it('aplica el tamaño small cuando se especifica', () => {
    render(<Badge {...defaultProps} size="small" />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('small')
  })

  it('aplica el tamaño large cuando se especifica', () => {
    render(<Badge {...defaultProps} size="large" />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('large')
  })

  it('aplica className personalizado', () => {
    render(<Badge {...defaultProps} className="custom-class" />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('custom-class')
  })

  it('combina múltiples props correctamente', () => {
    render(
      <Badge
        {...defaultProps}
        variant="secondary"
        color="success"
        size="large"
        className="custom-class"
      />
    )
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('secondary', 'success', 'large', 'custom-class')
  })

  it('renderiza children complejos correctamente', () => {
    render(
      <Badge>
        <span>Icon</span>
        <span>Text</span>
      </Badge>
    )

    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('tiene la clase badge base', () => {
    render(<Badge {...defaultProps} />)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('badge')
  })
})
