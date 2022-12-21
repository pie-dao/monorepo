describe('Test Profit Performance', () => {
  before(() => {
    cy.visit('/dashboard');
    cy.login();
  });

  it('should display a profit value and a performance percentage', () => {
    cy.get('[data-cy="pnl-block-performance"]')
      .contains(/\+|-*\d*\.?\d+%/)
      .should('exist');
    cy.get('[data-cy="pnl-block-profit"]')
      .contains('$20,030.43')
      .should('exist');
  });
});
