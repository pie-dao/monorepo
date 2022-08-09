import { SupportedChain } from '@shared/util-types';
import { isRight } from 'fp-ts/lib/Either';
import { MaiPolygonStrategy } from './MaiPolygonStrategy';

describe('mai polygon strategy', () => {
  const target: MaiPolygonStrategy = new MaiPolygonStrategy(
    '',
    {
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      symbol: 'MAI',
      name: 'MAI',
      coinGeckoId: 'mai',
      chain: SupportedChain.POLYGON,
      kind: 'erc20',
      marketData: [],
    },
    true,
  );

  test('APR', async () => {
    const result = await target.calculateAPR()();

    expect(isRight(result)).toBe(true);
  });

  test('APY', async () => {
    const result = await target.simulateAPY()();

    expect(isRight(result)).toBe(true);
  });
});
