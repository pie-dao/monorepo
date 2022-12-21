import { getAccountButton } from '../../support/app.po';

describe('Test User Login', () => {
  it('Connects with Metamask', () => {
    cy.visit('/');
    cy.login();
    getAccountButton().should('have.text', '0x...023');
  });
});
