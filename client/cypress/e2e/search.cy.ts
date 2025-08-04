describe('Búsqueda de Productos', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('debería mostrar resultados de búsqueda exitosa', () => {
    // Interceptar la llamada a la API con datos de prueba
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=iPhone**', {
        statusCode: 200,
        body: data.searchResults,
      }).as('searchProducts')
    })

    // Realizar búsqueda
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    // Verificar navegación
    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')

    // Esperar a que se complete la llamada a la API
    cy.wait('@searchProducts')

    // Verificar que se muestran los productos
    cy.get('[data-testid="product-card"]').should('have.length', 2)

    // Verificar el primer producto
    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.contains('iPhone 14 Pro Max 256GB').should('be.visible')
        cy.contains('$ 15.000,00').should('be.visible')
      })

    // Verificar el segundo producto
    cy.get('[data-testid="product-card"]')
      .eq(1)
      .within(() => {
        cy.contains('Samsung Galaxy S23 Ultra').should('be.visible')
        cy.contains('$ 12.000,00').should('be.visible')
      })
  })

  it('debería mostrar mensaje cuando no hay resultados', () => {
    // Interceptar la llamada a la API con resultados vacíos
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=producto-inexistente**', {
        statusCode: 200,
        body: data.emptyResults,
      }).as('emptySearch')
    })

    // Realizar búsqueda sin resultados
    cy.get('[data-testid="search-input"]').type('producto-inexistente')
    cy.get('[data-testid="search-button"]').click()

    // Esperar a que se complete la llamada a la API
    cy.wait('@emptySearch')

    // Verificar que se muestra el mensaje de no resultados
    cy.get('[data-testid="empty-results"]').should('be.visible')
    cy.contains(
      'No se encontraron productos para "producto-inexistente"'
    ).should('be.visible')
  })

  it('debería mostrar spinner mientras carga', () => {
    // Interceptar la llamada a la API con delay
    cy.intercept('GET', '**/items?search=iPhone**', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: {
          items: [],
          categories: [],
        },
      })
    }).as('delayedSearch')

    // Realizar búsqueda
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    // Verificar que se muestra el spinner
    cy.get('[data-testid="spinner"]').should('be.visible')

    // Esperar a que se complete la llamada
    cy.wait('@delayedSearch')

    // Verificar que el spinner desaparece
    cy.get('[data-testid="spinner"]').should('not.exist')
  })

  it('debería manejar errores de API correctamente', () => {
    // Interceptar la llamada a la API con error
    cy.intercept('GET', '**/items?search=iPhone**', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('errorSearch')

    // Realizar búsqueda
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    // Esperar a que se complete la llamada a la API
    cy.wait('@errorSearch')

    // Verificar que se muestra el componente de error
    cy.get('[data-testid="error-component"]').should('be.visible')
  })

  it('debería actualizar el breadcrumb con las categorías', () => {
    // Interceptar la llamada a la API
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=iPhone**', {
        statusCode: 200,
        body: data.searchResults,
      }).as('searchProducts')
    })

    // Realizar búsqueda
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    // Esperar a que se complete la llamada a la API
    cy.wait('@searchProducts')

    // Verificar que el breadcrumb se actualiza con las categorías
    cy.get('[data-testid="breadcrumb"]').should('be.visible')
    cy.get('[data-testid="breadcrumb-step-0"]').should(
      'contain',
      'Electrónicos'
    )
    cy.get('[data-testid="breadcrumb-step-1"]').should('contain', 'Celulares')
  })

  it('debería permitir búsqueda con Enter', () => {
    // Interceptar la llamada a la API
    cy.intercept('GET', '**/items?search=iPhone**', {
      statusCode: 200,
      body: {
        items: [],
        categories: [],
      },
    }).as('searchWithEnter')

    // Realizar búsqueda con Enter
    cy.get('[data-testid="search-input"]').type('iPhone{enter}')

    // Verificar navegación
    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')

    // Esperar a que se complete la llamada a la API
    cy.wait('@searchWithEnter')
  })

  it('debería limpiar la búsqueda al navegar a la página principal', () => {
    // Realizar búsqueda primero
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    // Verificar que está en la página de productos
    cy.url().should('include', '/items')

    // Navegar de vuelta a la página principal
    cy.visit('/')

    // Verificar que está en la página principal
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // Verificar que la barra de búsqueda está vacía
    cy.get('[data-testid="search-input"]').should('have.value', '')
  })
})
