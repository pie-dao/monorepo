describe('Test Vault tabs', () => {
  before(() => {
    cy.visit('/vaults/0x662556422AD3493fCAAc47767E8212f8C4E24513');
  });

  it('should display tabs with about content', () => {
    cy.get('[data-cy="tab-about"]').click();
    cy.get('[data-cy="tab-about"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
    cy.get('[data-cy="tab-about-content"]').should('be.visible');
    cy.get('[data-cy="contract-address"]')
      .invoke('text')
      .should('eq', '0x662556422AD3493fCAAc47767E8212f8C4E24513');
    cy.get('[data-cy="underlying-address"]')
      .invoke('text')
      .should('eq', '0x04068da6c83afcfa0e13ba15a6696662335d5b75');
  });

  it('should have at least one strategy', () => {
    cy.get('[data-cy="tab-strategyDetails"]').click();
    cy.get('[data-cy="tab-strategyDetails"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
    cy.get('[data-cy="strategy-item"]').should('have.length.greaterThan', 0);
  });
});
