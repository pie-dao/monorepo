describe('Test Dashboard Product Table', () => {
  before(() => {
    cy.visit('/dashboard');
    cy.login();
  });

  it('should display every single product', () => {
    cy.get('[data-cy="product-table-BCP"]').should('exist');
    cy.get('[data-cy="product-table-DEFI++"]').should('exist');
    cy.get('[data-cy="product-table-PLAY"]').should('exist');
  });

  it('should display the correct product data', () => {
    cy.get('[data-cy="product-table-DEFI++"]').within(() => {
      cy.get('[data-cy="name"]').should('have.text', 'DEFI++');
      cy.get('[data-cy="balance"]').should('have.text', '100.00');
      cy.get('[data-cy="price"]').should('have.text', '$200.00');
      cy.get('[data-cy="value"]').should('have.text', '$20,000.00');
      cy.get('[data-cy="percentage"]').should(
        'match',
        /\b(?<!\.)(?!0+(?:\.0+)?%)(?:\d|[1-9]\d|100)(?:(?<!100)\.\d+)?%/,
      );
    });
    cy.get('[data-cy="product-table-BCP"]').within(() => {
      cy.get('[data-cy="name"]').should('have.text', 'BCP');
      cy.get('[data-cy="balance"]').should('have.text', '1000.00');
      cy.get('[data-cy="price"]').should('have.text', '$200.00');
      cy.get('[data-cy="value"]').should('have.text', '$200,000.00');
      cy.get('[data-cy="percentage"]').should(
        'match',
        /\b(?<!\.)(?!0+(?:\.0+)?%)(?:\d|[1-9]\d|100)(?:(?<!100)\.\d+)?%/,
      );
    });
    cy.get('[data-cy="product-table-PLAY"]').within(() => {
      cy.get('[data-cy="name"]').should('have.text', 'PLAY');
      cy.get('[data-cy="balance"]').should('have.text', '1000.00');
      cy.get('[data-cy="price"]').should('have.text', '$200.00');
      cy.get('[data-cy="value"]').should('have.text', '$200,000.00');
      cy.get('[data-cy="percentage"]').should(
        'match',
        /\b(?<!\.)(?!0+(?:\.0+)?%)(?:\d|[1-9]\d|100)(?:(?<!100)\.\d+)?%/,
      );
    });
  });
});
