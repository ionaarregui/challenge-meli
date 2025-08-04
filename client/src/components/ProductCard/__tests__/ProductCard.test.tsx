import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../ProductCard'
import type { Product } from '../../../types/Product'

// Mock de los componentes hijos
jest.mock('../../AmountLabel', () => {
  return function MockAmountLabel(props: any) {
    return <div data-testid="amount-label">{JSON.stringify(props)}</div>
  }
})

jest.mock('../../Badge', () => {
  return function MockBadge(props: any) {
    return <div data-testid="badge">{props.children}</div>
  }
})

jest.mock('../../Rating', () => {
  return function MockRating(props: any) {
    return <div data-testid="rating">{JSON.stringify(props)}</div>
  }
})

const mockProduct: Product = {
  id: 'MLA123456789',
  title: 'iPhone 14 Pro Max 256GB',
  price: {
    currency: 'ARS',
    amount: 1500000,
    decimals: 2,
  },
  picture: 'https://example.com/iphone.jpg',
  condition: 'new',
  free_shipping: 'true',
  rating: {
    score: 4.5,
    count: 128,
  },
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ProductCard Component', () => {
  it('renderiza correctamente con la información del producto', () => {
    renderWithRouter(<ProductCard product={mockProduct} />)

    expect(screen.getByText('iPhone 14 Pro Max 256GB')).toBeInTheDocument()
    expect(screen.getByAltText('iPhone 14 Pro Max 256GB')).toBeInTheDocument()
    expect(screen.getByTestId('amount-label')).toBeInTheDocument()
  })

  it('muestra el badge de envío gratis cuando free_shipping es true', () => {
    renderWithRouter(<ProductCard product={mockProduct} />)

    expect(screen.getByTestId('badge')).toBeInTheDocument()
    expect(screen.getByText('Llega gratis mañana')).toBeInTheDocument()
  })

  it('no muestra el badge cuando free_shipping es false', () => {
    const productWithoutFreeShipping = {
      ...mockProduct,
      free_shipping: 'false',
    }

    renderWithRouter(<ProductCard product={productWithoutFreeShipping} />)

    expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
    expect(screen.queryByText('Llega gratis mañana')).not.toBeInTheDocument()
  })

  it('maneja el click correctamente', () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    renderWithRouter(<ProductCard product={mockProduct} />)

    const card = screen.getByText('iPhone 14 Pro Max 256GB').closest('div')
    fireEvent.click(card!)

    expect(mockNavigate).toHaveBeenCalledWith('/items/MLA123456789', {
      state: {
        product: mockProduct,
        from: '/',
      },
    })
  })

  it('renderiza la imagen con el src y alt correctos', () => {
    renderWithRouter(<ProductCard product={mockProduct} />)

    const image = screen.getByAltText('iPhone 14 Pro Max 256GB')
    expect(image).toHaveAttribute('src', 'https://example.com/iphone.jpg')
  })

  it('pasa las props correctas al componente AmountLabel', () => {
    renderWithRouter(<ProductCard product={mockProduct} />)

    const amountLabel = screen.getByTestId('amount-label')
    expect(amountLabel).toHaveTextContent(JSON.stringify(mockProduct.price))
  })

  it('renderiza correctamente sin rating', () => {
    const productWithoutRating = {
      ...mockProduct,
      rating: undefined,
    }

    renderWithRouter(<ProductCard product={productWithoutRating} />)

    expect(screen.getByText('iPhone 14 Pro Max 256GB')).toBeInTheDocument()
    expect(screen.getByTestId('amount-label')).toBeInTheDocument()
  })
})
