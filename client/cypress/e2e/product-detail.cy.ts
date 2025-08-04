describe('Detalle de Producto', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('debería navegar al detalle del producto desde la búsqueda', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')

    cy.get('[data-testid="product-card"]').first().click()

    cy.url().should('include', '/items/MLA')
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')
  })

  it('debería mostrar la información del vendedor', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.get('[data-testid="product-card"]').first().click()

    cy.get('[data-testid="buy-box-product"]').should('be.visible')
    cy.contains('Vendido por').should('be.visible')
  })

  it('debería mostrar la descripción del producto', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.get('[data-testid="product-card"]').first().click()

    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.contains('Descripción').should('be.visible')
  })

  it('debería mostrar spinner mientras carga', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.get('[data-testid="product-card"]').first().click()

    cy.get('[data-testid="product-detail-card"]').should('be.visible')
  })

  it('debería mostrar error cuando el producto no existe', () => {
    cy.visit('/items/MLA999999999', { failOnStatusCode: false })

    cy.get('[data-testid="product-not-found"]').should('be.visible')
  })

  it('debería mostrar error cuando hay un problema de red', () => {
    cy.intercept('GET', '**/items/MLA**', {
      forceNetworkError: true,
    }).as('networkError')

    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.get('[data-testid="product-card"]').first().click()
    cy.wait('@networkError')

    cy.get('[data-testid="error-component"]').should('be.visible')
  })

  it('debería actualizar el breadcrumb con las categorías del producto', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.get('[data-testid="product-card"]').first().click()

    cy.get('[data-testid="breadcrumb"]').should('be.visible')
  })

  it('debería ser responsive en diferentes tamaños de pantalla', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.get('[data-testid="product-card"]').first().click()

    cy.viewport(375, 667)
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')

    cy.viewport(768, 1024)
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')

    cy.viewport(1280, 720)
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')
  })
})
