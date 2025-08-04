import React from 'react'
import { render, screen } from '@testing-library/react'
import AmountLabel from '../index'
import type { Price } from '../../../types/Product'

describe('AmountLabel Component', () => {
  const mockPrice: Price = {
    currency: 'ARS',
    amount: 1500000,
    decimals: 2,
  }

  it('renderiza correctamente el precio formateado', () => {
    render(<AmountLabel {...mockPrice} />)

    expect(screen.getByText('$ 15.000,00')).toBeInTheDocument()
  })

  it('renderiza el precio sin decimales cuando decimals es 0', () => {
    const priceWithoutDecimals: Price = {
      currency: 'ARS',
      amount: 1500000,
      decimals: 0,
    }

    render(<AmountLabel {...priceWithoutDecimals} />)

    expect(screen.getByText('$ 1.500.000')).toBeInTheDocument()
  })

  it('renderiza el precio con USD correctamente', () => {
    const usdPrice: Price = {
      currency: 'USD',
      amount: 1500,
      decimals: 2,
    }

    render(<AmountLabel {...usdPrice} />)

    expect(screen.getByText('$ 15,00')).toBeInTheDocument()
  })

  it('muestra la leyenda de impuestos cuando showNotTax es true', () => {
    render(<AmountLabel {...mockPrice} showNotTax={true} />)

    expect(
      screen.getByText('Precio sin impuestos nacionales:')
    ).toBeInTheDocument()
    const priceElements = screen.getAllByText('$ 15.000,00')
    expect(priceElements).toHaveLength(2) // Una en el precio principal y otra en la leyenda
  })

  it('no muestra la leyenda de impuestos cuando showNotTax es false', () => {
    render(<AmountLabel {...mockPrice} showNotTax={false} />)

    expect(
      screen.queryByText('Precio sin impuestos nacionales:')
    ).not.toBeInTheDocument()
    expect(screen.getByText('$ 15.000,00')).toBeInTheDocument()
  })

  it('no muestra la leyenda de impuestos por defecto', () => {
    render(<AmountLabel {...mockPrice} />)

    expect(
      screen.queryByText('Precio sin impuestos nacionales:')
    ).not.toBeInTheDocument()
  })

  it('aplica estilos personalizados cuando se proporcionan', () => {
    const customStyle = { color: 'red', fontSize: '1.25rem' }
    render(<AmountLabel {...mockPrice} style={customStyle} />)

    const amountElement = screen.getByText('$ 15.000,00')
    expect(amountElement).toHaveStyle(
      'color: rgb(255, 0, 0); font-size: 1.25rem'
    )
  })

  it('maneja correctamente valores con muchos decimales', () => {
    const priceWithManyDecimals: Price = {
      currency: 'ARS',
      amount: 1500000,
      decimals: 4,
    }

    render(<AmountLabel {...priceWithManyDecimals} />)

    expect(screen.getByText('$ 150,0000')).toBeInTheDocument()
  })

  it('maneja correctamente valores muy pequeños', () => {
    const smallPrice: Price = {
      currency: 'ARS',
      amount: 1,
      decimals: 2,
    }

    render(<AmountLabel {...smallPrice} />)

    expect(screen.getByText('$ 0,01')).toBeInTheDocument()
  })

  it('renderiza correctamente con withoutTax', () => {
    const priceWithWithoutTax: Price = {
      currency: 'ARS',
      amount: 1500000,
      decimals: 2,
      withoutTax: 1200000,
    }

    render(<AmountLabel {...priceWithWithoutTax} />)

    expect(screen.getByText('$ 15.000,00')).toBeInTheDocument()
  })
})
