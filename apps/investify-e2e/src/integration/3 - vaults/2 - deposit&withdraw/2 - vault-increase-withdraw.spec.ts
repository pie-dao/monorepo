describe('Test Vault Increase Withdrawal', () => {
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

  it('should be possible to increase withdrwal into the vault', () => {
    cy.get('[data-cy="vault-input"]').type('1');
    cy.get('[data-cy="increase-withdrawal-button"]').click();
    cy.confirmMetamaskTransaction(undefined);
    cy.get('[data-cy="increaseWithdrawalSuccess"]').should('exist');
  });

  it('should be possible to deposit the max amount into the vault', () => {
    cy.get('[data-cy="max-button"]').should('not.contain', '974.508797');
    cy.get('[data-cy="max-button"]').click();
    cy.get('[data-cy="increase-withdrawal-button"]').click();
    cy.confirmMetamaskTransaction(undefined);
    cy.get('[data-cy="increaseWithdrawalSuccess"]').should('exist');
  });
});
