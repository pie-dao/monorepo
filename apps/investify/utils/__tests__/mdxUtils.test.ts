import { getProductData, getVaultData } from '../mdxUtils';
import { suppressConsoleLogs } from '../testing/suppress-console-logs';

const fallBackText = '### Content file missing or compiled with errors';

describe('getProductData', () => {
  it('should display data for a given product', () => {
    const product = 'PLAY';
    const { content } = getProductData(product);
    expect(content.descriptionContent).toBeDefined();
    expect(content.thesisContent).toBeDefined();
    expect(content.investmentFocusContent).toBeDefined();
  });

  it(
    'should display fallback data for non existing products',
    suppressConsoleLogs(() => {
      const product = 'NONEXISTING';
      const { content } = getProductData(product);
      expect(content.descriptionContent).toMatch(fallBackText);
      expect(content.thesisContent).toMatch(fallBackText);
      expect(content.investmentFocusContent).toMatch(fallBackText);
    }),
  );

  it('should display data for a given vault', () => {
    const vault = '0xe2c30A7A0f9Ac17393203F1B4c0979Ab552fFe69';
    const { content } = getVaultData(vault);
    expect(content.aboutContent).toBeDefined();
  });

  it(
    'should display fallback data for non existing vaults',
    suppressConsoleLogs(() => {
      const vault = '0x0000000000000000000000000000000000000000';
      const { content } = getVaultData(vault);
      expect(content.aboutContent).toMatch(fallBackText);
    }),
  );
});
