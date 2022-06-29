describe('Test Dashboard Vaults Table', () => {
  before(() => {
    cy.visit('/dashboard');
    cy.login();
  });

  it('should display every single vault', () => {
    cy.get('[data-cy="vault-table-*"]').should('exist');
  });

  it('should display the correct vault data', () => {
    cy.get('[data-cy^="vault-table-"]').each(($el) => {
      cy.wrap($el).within(() => {
        cy.get('[data-cy="apy"]').should('have.text', '100.00');
        cy.get('[data-cy="price"]').should('have.text', '$200.00');
        cy.get('[data-cy="value"]').should('have.text', '$20,000.00');
        cy.get('[data-cy="percentage"]').should(
          'match',
          /\b(?<!\.)(?!0+(?:\.0+)?%)(?:\d|[1-9]\d|100)(?:(?<!100)\.\d+)?%/,
        );
        cy.get('[data-cy="APY"]').should(
          'match',
          /APY \b(?<!\.)(?!0+(?:\.0+)?%)(?:\d|[1-9]\d|100)(?:(?<!100)\.\d+)?%/,
        );
      });
    });
  });
});
