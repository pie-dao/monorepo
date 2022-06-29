// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line no-unused-vars
  interface Chainable<Subject> {
    login(): void;
  }
}

Cypress.Commands.add('login', () => {
  cy.get('#connect-button').click();
  cy.get('#piedao-metamask-connect-button').click();
  cy.acceptMetamaskAccess(true);
  cy.switchToCypressWindow();
});
