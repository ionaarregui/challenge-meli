describe('Detalle de Producto', () => {
  beforeEach(() => {
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items/MLA123456789**', {
        statusCode: 200,
        body: data.productDetail
      }).as('getProductDetail')
    })
  })

  it('debería cargar el detalle del producto correctamente', () => {
    cy.visit('/items/MLA123456789')

    cy.wait('@getProductDetail')

    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')

    cy.contains('iPhone 14 Pro Max 256GB').should('be.visible')
    cy.contains('$ 15.000,00').should('be.visible')
    cy.contains('Condición: new').should('be.visible')
  })

  it('debería mostrar la información del vendedor', () => {
    cy.visit('/items/MLA123456789')
    cy.wait('@getProductDetail')

    cy.get('[data-testid="buy-box-product"]').within(() => {
      cy.contains('Vendedor: Test User').should('be.visible')
    })
  })

  it('debería mostrar la descripción del producto', () => {
    cy.visit('/items/MLA123456789')
    cy.wait('@getProductDetail')

    cy.contains('Descripción').should('be.visible')
    cy.contains('iPhone 14 Pro Max con chip A16 Bionic').should('be.visible')
  })

  it('debería mostrar spinner mientras carga', () => {
    cy.intercept('GET', '**/items/MLA123456789**', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: {
          author: { name: 'Test', lastname: 'User', userName: 'test_user', sold_quantity: '100' },
          item: {
            id: 'MLA123456789',
            title: 'iPhone 14 Pro Max 256GB',
            price: { currency: 'ARS', amount: 1500000, decimals: 2 },
            picture: 'https://example.com/iphone.jpg',
            condition: 'new',
            free_shipping: 'true',
            categories: ['Electrónicos'],
            mainPicture: 'https://example.com/iphone-main.jpg',
            variants: [],
            stock: 10,
            sold_quantity: '50',
            rating: { score: 4.5, count: 128 },
            bestPrice: true,
            description: 'Descripción del iPhone'
          }
        }
      })
    }).as('delayedProductDetail')

    cy.visit('/items/MLA123456789')

    cy.get('[data-testid="spinner"]').should('be.visible')

    cy.wait('@delayedProductDetail')

    cy.get('[data-testid="spinner"]').should('not.exist')
  })

  it('debería mostrar error cuando el producto no existe', () => {
    cy.intercept('GET', '**/items/MLA999999999**', {
      statusCode: 404,
      body: { error: 'Product not found' }
    }).as('productNotFound')

    cy.visit('/items/MLA999999999')
    cy.wait('@productNotFound')

    cy.get('[data-testid="product-not-found"]').should('be.visible')
  })

  it('debería mostrar error cuando hay un problema de red', () => {
    cy.intercept('GET', '**/items/MLA123456789**', {
      forceNetworkError: true
    }).as('networkError')

    cy.visit('/items/MLA123456789')
    cy.wait('@networkError')

    cy.get('[data-testid="error-component"]').should('be.visible')
  })

  it('debería navegar desde la lista de productos al detalle', () => {
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=iPhone**', {
        statusCode: 200,
        body: data.searchResults
      }).as('searchProducts')
    })

    cy.visit('/')
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()
    cy.wait('@searchProducts')

    cy.get('[data-testid="product-card"]').first().click()

    cy.url().should('include', '/items/MLA123456789')
    cy.wait('@getProductDetail')

    cy.get('[data-testid="product-detail-card"]').should('be.visible')
  })

  it('debería actualizar el breadcrumb con las categorías del producto', () => {
    cy.visit('/items/MLA123456789')
    cy.wait('@getProductDetail')

    cy.get('[data-testid="breadcrumb"]').should('be.visible')
    cy.get('[data-testid="breadcrumb-step-0"]').should('contain', 'Electrónicos')
    cy.get('[data-testid="breadcrumb-step-1"]').should('contain', 'Celulares')
    cy.get('[data-testid="breadcrumb-step-2"]').should('contain', 'iPhone')
  })

  it('debería ser responsive en diferentes tamaños de pantalla', () => {
    cy.visit('/items/MLA123456789')
    cy.wait('@getProductDetail')

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