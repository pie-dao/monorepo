import { SUPPORTED_CHAIN_DETAILS } from '.';

describe('Testing fetching a standard set of chains for testing', () => {
  it('Fetches in the right format', () => {
    const chainNames = Object.keys(SUPPORTED_CHAIN_DETAILS);
    const condition = chainNames.every((n) => typeof n === 'string');
    expect(condition).toBe(true);
  });

  it('Has the correct details for Ethereum, Polygon, Fantom', () => {
    expect(SUPPORTED_CHAIN_DETAILS.FANTOM.chainId).toEqual(250);
    expect(SUPPORTED_CHAIN_DETAILS.ETHEREUM.nativeCurrency.symbol).toEqual(
      'ETH',
    );
    expect(SUPPORTED_CHAIN_DETAILS.POLYGON.name).toEqual('Polygon Mainnet');
  });
});
