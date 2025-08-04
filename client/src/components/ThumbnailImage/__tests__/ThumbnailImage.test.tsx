import React from 'react'
import { render, screen } from '@testing-library/react'
import ThumbnailImage from '../ThumbnailImage'

describe('ThumbnailImage Component', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/image.jpg',
    alt: 'Test image',
  }

  it('renderiza correctamente con las props básicas', () => {
    render(<ThumbnailImage {...defaultProps} />)

    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('aplica el tamaño por defecto de 44px', () => {
    render(<ThumbnailImage {...defaultProps} />)

    const container = screen.getByAltText('Test image').closest('div')
    expect(container).toHaveStyle('width: 44px; height: 44px')
  })

  it('aplica el tamaño personalizado', () => {
    render(<ThumbnailImage {...defaultProps} size={80} />)

    const container = screen.getByAltText('Test image').closest('div')
    expect(container).toHaveStyle('width: 80px; height: 80px')
  })

  it('aplica la clase active cuando isActive es true', () => {
    render(<ThumbnailImage {...defaultProps} isActive={true} />)

    const container = screen.getByAltText('Test image').closest('div')
    expect(container).toHaveClass('active')
  })

  it('no aplica la clase active cuando isActive es false', () => {
    render(<ThumbnailImage {...defaultProps} isActive={false} />)

    const container = screen.getByAltText('Test image').closest('div')
    expect(container).not.toHaveClass('active')
  })

  it('no aplica la clase active cuando isActive no se proporciona', () => {
    render(<ThumbnailImage {...defaultProps} />)

    const container = screen.getByAltText('Test image').closest('div')
    expect(container).not.toHaveClass('active')
  })

  it('tiene la clase thumbnail base', () => {
    render(<ThumbnailImage {...defaultProps} />)

    const container = screen.getByAltText('Test image').closest('div')
    expect(container).toHaveClass('thumbnail')
  })

  it('maneja URLs de imagen con caracteres especiales', () => {
    const propsWithSpecialChars = {
      imageUrl: 'https://example.com/image with spaces.jpg',
      alt: 'Image with special chars',
    }

    render(<ThumbnailImage {...propsWithSpecialChars} />)

    const image = screen.getByAltText('Image with special chars')
    expect(image).toHaveAttribute(
      'src',
      'https://example.com/image with spaces.jpg'
    )
  })

  it('maneja alt text con caracteres especiales', () => {
    const propsWithSpecialAlt = {
      imageUrl: 'https://example.com/image.jpg',
      alt: 'Imagen con acentos: áéíóú',
    }

    render(<ThumbnailImage {...propsWithSpecialAlt} />)

    const image = screen.getByAltText('Imagen con acentos: áéíóú')
    expect(image).toBeInTheDocument()
  })

  it('mantiene la estructura DOM correcta', () => {
    render(<ThumbnailImage {...defaultProps} size={60} isActive={true} />)

    const container = screen.getByAltText('Test image').closest('div')
    const image = screen.getByAltText('Test image')

    expect(container).toContainElement(image)
    expect(container).toHaveClass('thumbnail', 'active')
    expect(container).toHaveStyle('width: 60px; height: 60px')
  })

  it('maneja tamaño 0', () => {
    render(<ThumbnailImage {...defaultProps} size={0} />)

    const container = screen.getByAltText('Test image').closest('div')
    expect(container).toHaveStyle('width: 0px; height: 0px')
  })

  it('maneja tamaño negativo', () => {
    render(<ThumbnailImage {...defaultProps} size={-10} />)

    const container = screen.getByAltText('Test image').closest('div')
    expect(container).toHaveStyle('width: -10px; height: -10px')
  })

  it('combina todas las props correctamente', () => {
    render(
      <ThumbnailImage
        imageUrl="https://example.com/custom.jpg"
        alt="Custom alt text"
        size={100}
        isActive={true}
      />
    )

    const container = screen.getByAltText('Custom alt text').closest('div')
    const image = screen.getByAltText('Custom alt text')

    expect(image).toHaveAttribute('src', 'https://example.com/custom.jpg')
    expect(container).toHaveClass('thumbnail', 'active')
    expect(container).toHaveStyle('width: 100px; height: 100px')
  })
})
