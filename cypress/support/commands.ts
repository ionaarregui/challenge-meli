/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      searchProducts(searchTerm: string): Chainable<void>
      
      waitForPageLoad(): Chainable<void>
      
      checkElementVisible(selector: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('searchProducts', (searchTerm: string) => {
  cy.get('[data-testid="search-input"]').should('be.visible').type(searchTerm)
  cy.get('[data-testid="search-button"]').should('be.visible').click()
})

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.get('[data-testid="spinner"]').should('not.exist')
})

Cypress.Commands.add('checkElementVisible', (selector: string) => {
  cy.get(selector).should('be.visible').should('not.be.disabled')
})

Cypress.Commands.add('mockApiResponse', (method: string, url: string, response: any) => {
  cy.intercept(method, url, response).as('apiCall')
})

export {} 