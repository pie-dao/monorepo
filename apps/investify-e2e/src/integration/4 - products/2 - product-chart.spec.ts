import {
  getChartRange,
  getNavLine,
  getNavToggle,
  getPriceLine,
  getPriceToggle,
} from '../../support/app.po';

describe('Test Product Page Chart Display', () => {
  before(() => {
    cy.visit('/products/PLAY');
    cy.login();
  });

  it('should display the price chart', () => {
    cy.get('[data-cy="product-price-chart"]').should('exist');
  });

  it('should be possible to change the chart period', () => {
    getChartRange().find('[data-cy="1D"]').click();
    cy.get('[data-cy="product-price-chart"]').should('exist');
    getChartRange().find('[data-cy="1W"]').click();
    cy.get('[data-cy="product-price-chart"]').should('exist');
    getChartRange().find('[data-cy="1M"]').click();
    cy.get('[data-cy="product-price-chart"]').should('exist');
    getChartRange().find('[data-cy="1Y"]').click();
    cy.get('[data-cy="product-price-chart"]').should('exist');
    getChartRange().find('[data-cy="ALL"]').click();
    cy.get('[data-cy="product-price-chart"]').should('exist');
  });

  it('should be possible to control chart with checkboxes', () => {
    // Initial state: Price is visible, NAV is not visible
    getPriceLine().should('exist');
    getNavLine().should('not.exist');
    // Toggle NAV
    getNavToggle().click();
    getNavLine().should('exist');
    // Toggle Price and NAV should not be removed
    getPriceToggle().click();
    getPriceLine().should('not.exist');
    getNavToggle().should('be.disabled');
    // Toggle back Price and Remove NAV, Price should be visible again and cannot be removed
    getPriceToggle().click();
    getNavToggle().click();
    getPriceToggle().should('be.disabled');
    getPriceLine().should('exist');
    getNavLine().should('not.exist');
  });
});
