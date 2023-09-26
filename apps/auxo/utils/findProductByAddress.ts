import { findKey, some } from 'lodash';
import { TokenConfig } from '../types/tokensConfig';
import products from '../config/products.json';

export function findProductByAddress(addressToFind: string): TokenConfig {
  const key = findKey(products, (value) => {
    return some(value.addresses, { address: addressToFind.toLowerCase() });
  });
  return products['USDC'];
}
