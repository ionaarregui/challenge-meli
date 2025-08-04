/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to search for products
       * @example cy.searchProducts('iPhone')
       */
      searchProducts(searchTerm: string): Chainable<void>
      
      /**
       * Custom command to wait for page load
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>
      
      /**
       * Custom command to check if element is visible and clickable
       * @example cy.checkElementVisible('[data-testid="search-button"]')
       */
      checkElementVisible(selector: string): Chainable<void>
    }
  }
}

// Comando personalizado para buscar productos
Cypress.Commands.add('searchProducts', (searchTerm: string) => {
  cy.get('[data-testid="search-input"]').should('be.visible').type(searchTerm)
  cy.get('[data-testid="search-button"]').should('be.visible').click()
})

// Comando personalizado para esperar a que la página cargue
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.get('[data-testid="spinner"]').should('not.exist')
})

// Comando personalizado para verificar que un elemento sea visible y clickeable
Cypress.Commands.add('checkElementVisible', (selector: string) => {
  cy.get(selector).should('be.visible').should('not.be.disabled')
})

// Comando para interceptar llamadas a la API y mockear respuestas
Cypress.Commands.add('mockApiResponse', (method: string, url: string, response: any) => {
  cy.intercept(method, url, response).as('apiCall')
})

export {} 