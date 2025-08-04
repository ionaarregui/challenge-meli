describe('Búsqueda de Productos', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('debería navegar a la página de productos al buscar', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')
  })

  it('debería mostrar mensaje cuando no hay resultados', () => {
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=producto-inexistente**', {
        statusCode: 200,
        body: data.emptyResults,
      }).as('emptySearch')
    })

    cy.get('[data-testid="search-input"]').type('producto-inexistente')
    cy.get('[data-testid="search-button"]').click()

    cy.wait('@emptySearch')

    cy.get('[data-testid="empty-results"]').should('be.visible')
    cy.contains(
      'No se encontraron productos para "producto-inexistente"'
    ).should('be.visible')
  })

  it('debería permitir búsqueda con Enter', () => {
    cy.get('[data-testid="search-input"]').type('iPhone{enter}')

    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')
  })

  it('debería limpiar la búsqueda al navegar a la página principal', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.url().should('include', '/items')

    cy.visit('/')

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.get('[data-testid="search-input"]').should('have.value', '')
  })

  it('debería mostrar la barra de búsqueda funcional', () => {
    cy.get('[data-testid="search-input"]').should('be.visible')
    cy.get('[data-testid="search-button"]').should('be.visible')

    cy.get('[data-testid="search-input"]')
      .should('be.visible')
      .and('not.be.disabled')
      .type('test')
      .should('have.value', 'test')
  })

  it('debería mostrar el breadcrumb correctamente', () => {
    cy.get('[data-testid="breadcrumb"]').should('be.visible')
  })
})
