export const getGreeting = () => cy.get('h1');
export const getAccountButton = () => cy.get('#connect-button');
export const getMetaMaskButton = () =>
  cy.get('#piedao-metamask-connect-button');
export const getButton = () => cy.get('button');
export const getFirstUnderlying = () =>
  cy.get('[data-cy^="underlying-assets-"]').first();
export const getChartRange = () =>
  cy.get('[data-cy="product-price-chart-range"]');

export const getPriceLine = () =>
  getChartRange().find('[data-cy="price-line"]');
export const getNavLine = () => getChartRange().find('[data-cy="nav-line"]');
export const getPriceToggle = () =>
  getChartRange().find('[data-cy="price-toggle"]');
export const getNavToggle = () =>
  getChartRange().find('[data-cy="nav-toggle"]');
