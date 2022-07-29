import { getProductData } from '../mdxUtils';

describe('getProductData', () => {
  it('should display data for a given product', () => {
    const product = 'PLAY';
    const productData = getProductData(product);
    expect(productData.content.descriptionContent).toBeDefined();
    expect(productData.content.thesisContent).toBeDefined();
    expect(productData.content.investmentFocusContent).toBeDefined();
  });

  it('should display fallback data for non existing products', () => {
    const product = 'NONEXISTING';
    const productData = getProductData(product);
    expect(productData.content.descriptionContent).toBeDefined();
    expect(productData.content.thesisContent).toBeDefined();
    expect(productData.content.investmentFocusContent).toBeDefined();
  });
});
