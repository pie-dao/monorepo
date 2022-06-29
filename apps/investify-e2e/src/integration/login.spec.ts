import { getAccountButton, getMetaMaskButton } from '../support/app.po';

describe('Test User Login', () => {
  before(() => {
    cy.disconnectMetamaskWalletFromAllDapps();
  });

  it('Connects with Metamask', () => {
    cy.visit('/');
    getAccountButton().click();
    getMetaMaskButton().click();
    cy.acceptMetamaskAccess(true).then((connected) => {
      expect(connected).to.be.true;
    });
    cy.switchToCypressWindow().then((cypressWindowActive) => {
      expect(cypressWindowActive).to.be.true;
    });

    getAccountButton().should('have.text', '0x...023');
  });
});
