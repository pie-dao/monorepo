describe('Test Product Page Data Display', () => {
  before(() => {
    cy.visit('/products/PLAY');
  });

  it('should display product name', () => {
    cy.get('[data-cy="product-name"]').should('have.text', 'PLAY');
  });

  it('should display risk grade', () => {
    cy.get('[data-cy="product-risk-grade"]')
      .invoke('text')
      .should('match', /(AAA|N\/A)/);
  });

  it('should display from inception percentage', () => {
    cy.get('[data-cy="product-inception"]')
      .invoke('text')
      .should(
        'match',
        /((\+|-)*(?=.*\d)(([1-9]\d{0,2}(,*\d{3})*)|0)?(\.\d{1,2})?%|N\/A)/,
      );
  });

  it('should display discount/premium rate', () => {
    cy.get('[data-cy="product-discount"]')
      .invoke('text')
      .should(
        'match',
        /((\+|-)*(?=.*\d)(([1-9]\d{0,2}(,*\d{3})*)|0)?(\.\d{1,2})?%|N\/A)/,
      );
  });

  it('should display interests', () => {
    cy.get('[data-cy="product-interests"]')
      .invoke('text')
      .should(
        'match',
        /((\+|-)*(?=.*\d)(([1-9]\d{0,2}(,*\d{3})*)|0)?(\.\d{1,2})?%|N\/A)/,
      );
  });

  it('should display current price', () => {
    cy.get('[data-cy="product-current-price"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$|N\/A)/,
      );
  });

  it('should display 24 houre price change', () => {
    cy.get('[data-cy="product-24-hour-change-change"]')
      .invoke('text')
      .should(
        'match',
        /((\+|-)*(?=.*\d)(([1-9]\d{0,2}(,*\d{3})*)|0)?(\.\d{1,2})?%|N\/A)/,
      );
    cy.get('[data-cy="product-24-hour-change-price"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$|N\/A)/,
      );
  });

  it('should display product NAV', () => {
    cy.get('[data-cy="product-nav"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$|N\/A)/,
      );
  });
});
