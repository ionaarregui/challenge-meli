describe('Página Principal', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('debería cargar la página principal correctamente', () => {
    cy.get('body').should('be.visible')

    cy.title().should('eq', 'Mercado Libre - challenge')

    cy.get('header').should('be.visible')

    cy.get('footer').should('be.visible')
  })

  it('debería mostrar el banner de la página principal', () => {
    cy.get('img[alt*="envio gratis"]').should('be.visible')

    cy.get('img[alt*="envio gratis"]')
      .should('have.attr', 'src')
      .and('include', 'http2.mlstatic.com')
  })

  it('debería tener la barra de búsqueda funcional', () => {
    cy.get('[data-testid="search-input"]').should('be.visible')

    cy.get('[data-testid="search-button"]').should('be.visible')

    cy.get('[data-testid="search-input"]')
      .should('be.visible')
      .and('not.be.disabled')
      .type('test')
      .should('have.value', 'test')
  })

  it('debería navegar a la página de productos al buscar', () => {
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()

    cy.url().should('include', '/items')
    cy.url().should('include', 'search=iPhone')
  })

  it('debería mostrar el breadcrumb correctamente', () => {
    cy.get('[data-testid="breadcrumb"]').should('be.visible')
  })

  it('debería ser responsive en diferentes tamaños de pantalla', () => {
    cy.viewport(375, 667)
    cy.get('header').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')

    cy.viewport(768, 1024)
    cy.get('header').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')

    cy.viewport(1280, 720)
    cy.get('header').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')
  })
})
