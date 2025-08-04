describe('Página Principal', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('debería cargar la página principal correctamente', () => {
    // Verificar que la página se carga
    cy.get('body').should('be.visible')
    
    // Verificar que el título de la página es correcto
    cy.title().should('eq', 'Mercado Libre - challenge')
    
    // Verificar que el header está presente
    cy.get('header').should('be.visible')
    
    // Verificar que el footer está presente
    cy.get('footer').should('be.visible')
  })

  it('debería mostrar el banner de la página principal', () => {
    // Verificar que el banner está presente
    cy.get('img[alt*="envio gratis"]').should('be.visible')
    
    // Verificar que el banner tiene la URL correcta
    cy.get('img[alt*="envio gratis"]')
      .should('have.attr', 'src')
      .and('include', 'http2.mlstatic.com')
  })

  it('debería tener la barra de búsqueda funcional', () => {
    // Verificar que la barra de búsqueda está presente
    cy.get('[data-testid="search-input"]').should('be.visible')
    
    // Verificar que el botón de búsqueda está presente
    cy.get('[data-testid="search-button"]').should('be.visible')
    
    // Verificar que se puede escribir en la barra de búsqueda
    cy.get('[data-testid="search-input"]')
      .should('be.visible')
      .and('not.be.disabled')
      .type('test')
      .should('have.value', 'test')
  })

  it('debería navegar a la página de productos al buscar', () => {
    // Interceptar la llamada a la API
    cy.intercept('GET', '**/items?search=iPhone**', {
      statusCode: 200,
      body: {
        items: [
          {
            id: 'MLA123456789',
            title: 'iPhone 14 Pro Max',
            price: { currency: 'ARS', amount: 1500000, decimals: 2 },
            picture: 'https://example.com/iphone.jpg',
            condition: 'new',
            free_shipping: 'true',
            rating: { score: 4.5, count: 128 }
          }
        ],
        categories: ['Electrónicos', 'Celulares']
      }
    }).as('searchProducts')

    // Realizar búsqueda
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    // Verificar que se navega a la página de productos
    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')

    // Esperar a que se complete la llamada a la API
    cy.wait('@searchProducts')
  })

  it('debería mostrar el breadcrumb correctamente', () => {
    // Verificar que el breadcrumb está presente
    cy.get('[data-testid="breadcrumb"]').should('be.visible')
  })

  it('debería ser responsive en diferentes tamaños de pantalla', () => {
    // Test en móvil
    cy.viewport(375, 667)
    cy.get('header').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')

    // Test en tablet
    cy.viewport(768, 1024)
    cy.get('header').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')

    // Test en desktop
    cy.viewport(1280, 720)
    cy.get('header').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')
  })
}) 