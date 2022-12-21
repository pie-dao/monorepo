describe('Test Vault Deposit', () => {
  before(() => {
    cy.visit('/vaults/0x662556422AD3493fCAAc47767E8212f8C4E24513');
    cy.login();
  });

  it('should display the Deposit Tab', () => {
    cy.get('[data-cy="vault-tab-deposit"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
  });

  it.skip('should be possible to approve the vault to spend', () => {
    cy.get('[data-cy="max-button"]').click();
    cy.get('[data-cy="approve-button"]').click();
    cy.confirmMetamaskPermissionToSpend();
    cy.get('[data-cy="approveDepositSuccess"]').should('exist');
  });

  it('should be possible to deposit into the vault', () => {
    cy.get('[data-cy="vault-input"]').type('100');
    cy.get('[data-cy="deposit-button"]').click();
    cy.confirmMetamaskTransaction(undefined);
    cy.get('[data-cy="makeDepositSuccess"]').should('exist');
  });

  it('should be possible to deposit the max amount into the vault', () => {
    cy.get('[data-cy="max-button"]').should('not.contain', '1000');
    cy.get('[data-cy="max-button"]').click();
    cy.get('[data-cy="deposit-button"]').click();
    cy.confirmMetamaskTransaction(undefined);
    cy.get('[data-cy="makeDepositSuccess"]').should('exist');
  });
});
