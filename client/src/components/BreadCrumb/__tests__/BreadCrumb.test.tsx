import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import BreadCrumb from '../BreadCrumb'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('BreadCrumb Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente con un solo paso', () => {
    const steps = ['Electrónicos']
    renderWithRouter(<BreadCrumb steps={steps} />)

    expect(screen.getByText('Electrónicos')).toBeInTheDocument()
    expect(screen.queryByText(' > ')).not.toBeInTheDocument()
  })

  it('renderiza correctamente con múltiples pasos', () => {
    const steps = ['Electrónicos', 'Celulares', 'iPhone']
    renderWithRouter(<BreadCrumb steps={steps} />)

    expect(screen.getByText(/Electrónicos/)).toBeInTheDocument()
    expect(screen.getByText(/Celulares/)).toBeInTheDocument()
    expect(screen.getByText(/iPhone/)).toBeInTheDocument()

    const container = screen.getByText(/Electrónicos/).closest('div')
    const stepElements = container?.querySelectorAll('.breadcrumb-step')
    const separators = Array.from(stepElements || []).filter((element) =>
      element.textContent?.includes(' > ')
    )
    expect(separators).toHaveLength(2)
  })

  it('maneja el click en un paso correctamente', () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    const steps = ['Electrónicos', 'Celulares']
    renderWithRouter(<BreadCrumb steps={steps} />)

    const firstStep = screen.getByText(/Electrónicos/)
    fireEvent.click(firstStep)

    expect(mockNavigate).toHaveBeenCalledWith('/items?search=Electrónicos')
  })

  it('maneja el click en el último paso', () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    const steps = ['Electrónicos', 'Celulares', 'iPhone']
    renderWithRouter(<BreadCrumb steps={steps} />)

    const lastStep = screen.getByText(/iPhone/)
    fireEvent.click(lastStep)

    expect(mockNavigate).toHaveBeenCalledWith('/items?search=iPhone')
  })

  it('no muestra separador después del último paso', () => {
    const steps = ['Electrónicos', 'Celulares', 'iPhone']
    renderWithRouter(<BreadCrumb steps={steps} />)

    const container = screen.getByText(/Electrónicos/).closest('div')
    const stepElements = container?.querySelectorAll('.breadcrumb-step')
    const separators = Array.from(stepElements || []).filter((element) =>
      element.textContent?.includes(' > ')
    )
    expect(separators).toHaveLength(2)
  })

  it('maneja pasos con caracteres especiales', () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    const steps = ['Electrónicos & Audio', 'Celulares y Smartphones']
    renderWithRouter(<BreadCrumb steps={steps} />)

    const firstStep = screen.getByText(/Electrónicos & Audio/)
    fireEvent.click(firstStep)

    expect(mockNavigate).toHaveBeenCalledWith(
      '/items?search=Electrónicos & Audio'
    )
  })

  it('maneja array vacío', () => {
    renderWithRouter(<BreadCrumb steps={[]} />)

    expect(screen.queryByText(' > ')).not.toBeInTheDocument()
  })

  it('tiene la estructura DOM correcta', () => {
    const steps = ['Electrónicos', 'Celulares']
    renderWithRouter(<BreadCrumb steps={steps} />)

    const container = screen.getByText(/Electrónicos/).closest('div')
    expect(container).toHaveClass('breadcrumb')

    const stepsElements = container?.querySelectorAll('.breadcrumb-step')
    expect(stepsElements).toHaveLength(2)
  })

  it('es clickeable en todos los pasos', () => {
    const mockNavigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate)

    const steps = ['Electrónicos', 'Celulares', 'iPhone']
    renderWithRouter(<BreadCrumb steps={steps} />)

    const allSteps = screen.getAllByText(/Electrónicos|Celulares|iPhone/)

    allSteps.forEach((step, index) => {
      fireEvent.click(step)
      expect(mockNavigate).toHaveBeenCalledWith(`/items?search=${steps[index]}`)
    })
  })

  it('mantiene el orden correcto de los pasos', () => {
    const steps = ['Electrónicos', 'Celulares', 'iPhone']
    renderWithRouter(<BreadCrumb steps={steps} />)

    const container = screen.getByText(/Electrónicos/).closest('div')
    const stepElements = container?.querySelectorAll('.breadcrumb-step')

    expect(stepElements?.[0]).toHaveTextContent('Electrónicos')
    expect(stepElements?.[1]?.textContent).toMatch(/Celulares > /)
    expect(stepElements?.[2]).toHaveTextContent('iPhone')
  })
})
