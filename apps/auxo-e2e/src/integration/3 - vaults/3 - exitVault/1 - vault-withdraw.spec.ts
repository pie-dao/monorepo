describe('Test Vault Batch Burn exit', () => {
  before(() => {
    cy.visit('/vaults/0x662556422AD3493fCAAc47767E8212f8C4E24513');
    cy.login();
  });

  it('should display the Withdraw Tab', () => {
    cy.get('[data-cy="vault-tab-withdraw"]').click();
    cy.get('[data-cy="vault-tab-withdraw"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
  });

  it('should be possible to exit the batch burn', () => {
    cy.get('[data-cy="confirm-withdrawal-button"]').should('be.visible');
    cy.get('[data-cy="confirm-withdrawal-button"]').click();
    cy.confirmMetamaskTransaction(undefined);
    cy.get('[data-cy="confirmWithdrawalSuccess"]').should('exist');
  });
});
