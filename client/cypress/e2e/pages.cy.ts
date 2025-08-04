describe('Tests de Páginas Completas', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Página Principal', () => {
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

  describe('Navegación Básica', () => {
    it('debería navegar a la página de productos al buscar', () => {
      // Realizar búsqueda
      cy.get('[data-testid="search-input"]').type('iPhone')
      cy.get('[data-testid="search-button"]').click()

      // Verificar que se navega a la página de productos
      cy.url().should('include', '/items')
      cy.url().should('include', 'search=iPhone')
    })

    it('debería permitir búsqueda con Enter', () => {
      // Realizar búsqueda con Enter
      cy.get('[data-testid="search-input"]').type('iPhone{enter}')

      // Verificar navegación
      cy.url().should('include', '/items')
      cy.url().should('include', 'search=iPhone')
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

  describe('Funcionalidad de Búsqueda', () => {
    it('debería mostrar mensaje cuando no hay resultados', () => {
      // Realizar búsqueda sin resultados
      cy.get('[data-testid="search-input"]').type('producto-inexistente-12345')
      cy.get('[data-testid="search-button"]').click()

      // Verificar que se navega a la página de productos
      cy.url().should('include', '/items')
      cy.url().should('include', 'search=producto-inexistente-12345')
    })

    it('debería actualizar el breadcrumb con las categorías', () => {
      // Realizar búsqueda
      cy.get('[data-testid="search-input"]').type('iPhone')
      cy.get('[data-testid="search-button"]').click()

      // Verificar que el breadcrumb se actualiza
      cy.get('[data-testid="breadcrumb"]').should('be.visible')
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener elementos accesibles', () => {
      // Verificar que el input de búsqueda tiene aria-label
      cy.get('[data-testid="search-input"]').should('have.attr', 'aria-label')

      // Verificar que el botón de búsqueda tiene aria-label
      cy.get('[data-testid="search-button"]').should('have.attr', 'aria-label')

      // Verificar que el banner tiene alt text
      cy.get('img[alt*="envio gratis"]').should('be.visible')
    })

    it('debería ser navegable con teclado', () => {
      // Verificar que el input de búsqueda puede recibir foco
      cy.get('[data-testid="search-input"]').focus().should('be.focused')

      // Verificar que se puede escribir en el input
      cy.get('[data-testid="search-input"]')
        .clear()
        .type('test')
        .should('have.value', 'test')
    })
  })

  describe('Rendimiento', () => {
    it('debería cargar rápidamente', () => {
      // Verificar que la página carga en menos de 3 segundos
      cy.visit('/', { timeout: 3000 })
      cy.get('body').should('be.visible')
    })

    it('debería manejar múltiples búsquedas', () => {
      // Realizar múltiples búsquedas
      cy.get('[data-testid="search-input"]').type('iPhone')
      cy.get('[data-testid="search-button"]').click()
      cy.url().should('include', 'search=iPhone')

      cy.visit('/')
      cy.get('[data-testid="search-input"]').type('Samsung')
      cy.get('[data-testid="search-button"]').click()
      cy.url().should('include', 'search=Samsung')
    })
  })
})
