import { getGreeting, getButton } from '../support/app.po';

describe('investify', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message and have a clickable button', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Welcome to the Investify Platform');
    getButton().click();
  });
});
