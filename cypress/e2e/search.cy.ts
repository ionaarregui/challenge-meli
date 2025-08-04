describe('Búsqueda de Productos', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('debería mostrar resultados de búsqueda exitosa', () => {
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=iPhone**', {
        statusCode: 200,
        body: data.searchResults
      }).as('searchProducts')
    })

    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')

    cy.wait('@searchProducts')

    cy.get('[data-testid="product-card"]').should('have.length', 2)
    
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('iPhone 14 Pro Max 256GB').should('be.visible')
      cy.contains('$ 15.000,00').should('be.visible')
    })

    cy.get('[data-testid="product-card"]').eq(1).within(() => {
      cy.contains('Samsung Galaxy S23 Ultra').should('be.visible')
      cy.contains('$ 12.000,00').should('be.visible')
    })
  })

  it('debería mostrar mensaje cuando no hay resultados', () => {
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=producto-inexistente**', {
        statusCode: 200,
        body: data.emptyResults
      }).as('emptySearch')
    })

    cy.get('[data-testid="search-input"]').type('producto-inexistente')
    cy.get('[data-testid="search-button"]').click()

    cy.wait('@emptySearch')

    cy.get('[data-testid="empty-results"]').should('be.visible')
    cy.contains('No se encontraron productos para "producto-inexistente"').should('be.visible')
  })

  it('debería mostrar spinner mientras carga', () => {
    cy.intercept('GET', '**/items?search=iPhone**', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: {
          items: [],
          categories: []
        }
      })
    }).as('delayedSearch')

    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.get('[data-testid="spinner"]').should('be.visible')

    cy.wait('@delayedSearch')

    cy.get('[data-testid="spinner"]').should('not.exist')
  })

  it('debería manejar errores de API correctamente', () => {
    cy.intercept('GET', '**/items?search=iPhone**', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('errorSearch')

    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.wait('@errorSearch')

    cy.get('[data-testid="error-component"]').should('be.visible')
  })

  it('debería actualizar el breadcrumb con las categorías', () => {
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=iPhone**', {
        statusCode: 200,
        body: data.searchResults
      }).as('searchProducts')
    })

    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.wait('@searchProducts')

    cy.get('[data-testid="breadcrumb"]').should('be.visible')
    cy.get('[data-testid="breadcrumb-step-0"]').should('contain', 'Electrónicos')
    cy.get('[data-testid="breadcrumb-step-1"]').should('contain', 'Celulares')
  })

  it('debería permitir búsqueda con Enter', () => {
    cy.intercept('GET', '**/items?search=iPhone**', {
      statusCode: 200,
      body: {
        items: [],
        categories: []
      }
    }).as('searchWithEnter')

    cy.get('[data-testid="search-input"]').type('iPhone{enter}')

    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')

    cy.wait('@searchWithEnter')
  })

  it('debería limpiar la búsqueda al navegar a la página principal', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.url().should('include', '/items')

    cy.visit('/')

    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    cy.get('[data-testid="search-input"]').should('have.value', '')
  })
}) 