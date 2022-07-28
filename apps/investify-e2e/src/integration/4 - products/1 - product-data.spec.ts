import { getFirstUnderlying } from '../../support/app.po';

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

  it('should display product underlying assets', () => {
    getFirstUnderlying().should('exist');
  });

  it('should display product underlying data', () => {
    getFirstUnderlying()
      .find('[data-cy="underlying-asset-image"]')
      .should('exist');
    getFirstUnderlying()
      .find('[data-cy="underlying-asset-symbol"]')
      .should('exist');
    getFirstUnderlying()
      .find('[data-cy="underlying-asset-24h-price-change"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,3})?$|N\/A)/,
      );
    getFirstUnderlying()
      .find('[data-cy="underlying-asset-24h-price-percentage-change"]')
      .invoke('text')
      .should(
        'match',
        /((\+|-)*(?=.*\d)(([1-9]\d{0,2}(,*\d{3})*)|0)?(\.\d{1,2})?%|N\/A)/,
      );
    getFirstUnderlying()
      .find('[data-cy="underlying-asset-amount-per-token"]')
      .invoke('text')
      .should(
        'match',
        /(?=.*\d)^(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{0,2})?(M|K|B|T)?/,
      );
    getFirstUnderlying()
      .find('[data-cy="underlying-asset-total-held"]')
      .invoke('text')
      .should(
        'match',
        /(?=.*\d)^(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{0,2})?(M|K|B|T)?/,
      );
    getFirstUnderlying()
      .find('[data-cy="underlying-asset-allocation"]')
      .invoke('text')
      .should(
        'match',
        /(?=.*\d)^(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{0,2})?(M|K|B|T)?/,
      );
  });

  it('should display tabs with description content', () => {
    cy.get('[data-cy="product-tab-description"]').click();
    cy.get('[data-cy="product-tab-description"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
  });

  it('should display tabs with thesis', () => {
    cy.get('[data-cy="product-tab-thesis"]').click();
    cy.get('[data-cy="product-tab-thesis"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
    cy.get('[data-cy="product-tab-thesis-prospectus"]').should(
      'have.attr',
      'href',
      'https://gateway.pinata.cloud/ipfs/QmcNBx57qyjsuENaTZunsG7C12PN8i9t9BKjzaWzGSaBVK',
    );
  });

  it('should display tabs with details', () => {
    cy.get('[data-cy="product-tab-details"]').click();
    cy.get('[data-cy="product-tab-details"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
    cy.get('[data-cy="key-marketCap"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,3})?$|N\/A)/,
      );

    cy.get('[data-cy="key-holders"]')
      .invoke('text')
      .should('match', /(^[1-9]\d*$|N\/A)/);

    cy.get('[data-cy="key-allTimeHigh"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,3})?$|N\/A)/,
      );

    cy.get('[data-cy="key-allTimeLow"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,3})?$|N\/A)/,
      );

    cy.get('[data-cy="key-managementFee"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)(([1-9]\d{0,2}(,*\d{3})*)|0)?(\.\d{1,2})?%|N\/A)/,
      );

    cy.get('[data-cy="key-swapFee"]')
      .invoke('text')
      .should(
        'match',
        /((?=.*\d)(([1-9]\d{0,2}(,*\d{3})*)|0)?(\.\d{1,2})?%|N\/A)/,
      );

    cy.get('[data-cy="key-totalSupply"]')
      .invoke('text')
      .should(
        'match',
        /(?=.*\d)^(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{0,2})?(M|K|B|T)?/,
      );

    cy.get('[data-cy="product-tab-details-contract"]').should(
      'have.attr',
      'href',
      'https://etherscan.io/address/0x33e18a092a93ff21ad04746c7da12e35d34dc7c4',
    );
  });
});
