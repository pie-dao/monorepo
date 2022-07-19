describe('Test Vault Opt-In', () => {
  before(() => {
    cy.visit('/vaults/0x662556422AD3493fCAAc47767E8212f8C4E24513');
    cy.login();
  });

  it('should display the Opt In tab', () => {
    cy.get('[data-cy="vault-tab-optin"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
  });

  it('should not be possible to visit deposit and withdraw tabs', () => {
    cy.get('[data-cy="vault-tab-deposit"]').should('be.disabled');
    cy.get('[data-cy="vault-tab-withdraw"]').should('be.disabled');
  });

  it('should be possible to Opt In inside the vault', () => {
    cy.get('[data-cy="vault-optin-button"]').click();
    cy.confirmMetamaskTransaction(undefined);
    cy.get('[data-cy="authorizeDepositorSuccess"]').should('exist');
  });
});
