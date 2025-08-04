describe('Detalle de Producto', () => {
  beforeEach(() => {
    // Interceptar la llamada a la API del detalle del producto
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items/MLA123456789**', {
        statusCode: 200,
        body: data.productDetail
      }).as('getProductDetail')
    })
  })

  it('debería cargar el detalle del producto correctamente', () => {
    // Visitar directamente la página de detalle
    cy.visit('/items/MLA123456789')

    // Esperar a que se complete la llamada a la API
    cy.wait('@getProductDetail')

    // Verificar que se muestra el detalle del producto
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')

    // Verificar información del producto
    cy.contains('iPhone 14 Pro Max 256GB').should('be.visible')
    cy.contains('$ 15.000,00').should('be.visible')
    cy.contains('Condición: new').should('be.visible')
  })

  it('debería mostrar la información del vendedor', () => {
    cy.visit('/items/MLA123456789')
    cy.wait('@getProductDetail')

    // Verificar información del vendedor
    cy.get('[data-testid="buy-box-product"]').within(() => {
      cy.contains('Vendedor: Test User').should('be.visible')
    })
  })

  it('debería mostrar la descripción del producto', () => {
    cy.visit('/items/MLA123456789')
    cy.wait('@getProductDetail')

    // Verificar que se muestra la descripción
    cy.contains('Descripción').should('be.visible')
    cy.contains('iPhone 14 Pro Max con chip A16 Bionic').should('be.visible')
  })

  it('debería mostrar spinner mientras carga', () => {
    // Interceptar con delay para simular carga lenta
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

    // Verificar que se muestra el spinner
    cy.get('[data-testid="spinner"]').should('be.visible')

    // Esperar a que se complete la llamada
    cy.wait('@delayedProductDetail')

    // Verificar que el spinner desaparece
    cy.get('[data-testid="spinner"]').should('not.exist')
  })

  it('debería mostrar error cuando el producto no existe', () => {
    // Interceptar con error 404
    cy.intercept('GET', '**/items/MLA999999999**', {
      statusCode: 404,
      body: { error: 'Product not found' }
    }).as('productNotFound')

    cy.visit('/items/MLA999999999')
    cy.wait('@productNotFound')

    // Verificar que se muestra el componente de producto no encontrado
    cy.get('[data-testid="product-not-found"]').should('be.visible')
  })

  it('debería mostrar error cuando hay un problema de red', () => {
    // Interceptar con error de red
    cy.intercept('GET', '**/items/MLA123456789**', {
      forceNetworkError: true
    }).as('networkError')

    cy.visit('/items/MLA123456789')
    cy.wait('@networkError')

    // Verificar que se muestra el componente de error
    cy.get('[data-testid="error-component"]').should('be.visible')
  })

  it('debería navegar desde la lista de productos al detalle', () => {
    // Interceptar búsqueda de productos
    cy.fixture('products.json').then((data) => {
      cy.intercept('GET', '**/items?search=iPhone**', {
        statusCode: 200,
        body: data.searchResults
      }).as('searchProducts')
    })

    // Ir a la página principal y buscar
    cy.visit('/')
    cy.get('[data-testid="search-input"]').type('iPhone')
    cy.get('[data-testid="search-button"]').click()
    cy.wait('@searchProducts')

    // Hacer click en el primer producto
    cy.get('[data-testid="product-card"]').first().click()

    // Verificar que navega al detalle del producto
    cy.url().should('include', '/items/MLA123456789')
    cy.wait('@getProductDetail')

    // Verificar que se muestra el detalle
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
  })

  it('debería actualizar el breadcrumb con las categorías del producto', () => {
    cy.visit('/items/MLA123456789')
    cy.wait('@getProductDetail')

    // Verificar que el breadcrumb se actualiza con las categorías
    cy.get('[data-testid="breadcrumb"]').should('be.visible')
    cy.get('[data-testid="breadcrumb-step-0"]').should('contain', 'Electrónicos')
    cy.get('[data-testid="breadcrumb-step-1"]').should('contain', 'Celulares')
    cy.get('[data-testid="breadcrumb-step-2"]').should('contain', 'iPhone')
  })

  it('debería ser responsive en diferentes tamaños de pantalla', () => {
    cy.visit('/items/MLA123456789')
    cy.wait('@getProductDetail')

    // Test en móvil
    cy.viewport(375, 667)
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')

    // Test en tablet
    cy.viewport(768, 1024)
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')

    // Test en desktop
    cy.viewport(1280, 720)
    cy.get('[data-testid="product-detail-card"]').should('be.visible')
    cy.get('[data-testid="buy-box-product"]').should('be.visible')
  })
}) 