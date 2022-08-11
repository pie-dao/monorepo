import { isRight, Right } from 'fp-ts/lib/Either';
import { CoinGeckoAdapter, DEFAULT_FUNDS, MarketDto, CG_RATE_LIMIT } from '.';

const coinId = 'piedao-balanced-crypto-pie';
const vsCurrency = 'usd';
const days = '1';

jest.setTimeout(60 * 1000);

describe('Given a Coin Gecko adapter', () => {
  let target: CoinGeckoAdapter;

  beforeAll(() => {
    target = new CoinGeckoAdapter();
  });

  test('When we get the markets Then we get a valid list', async () => {
    const result = (await target.getMarkets()()) as Right<MarketDto[]>;

    expect(DEFAULT_FUNDS.map((it) => it.symbol).sort()).toEqual(
      result.right.map((it) => it.symbol).sort(),
    );
  });

  test('When we get the metadata Then it succeeds', async () => {
    const result = await target.getCoinMetadata(coinId)();

    expect(isRight(result)).toBeTruthy();
  });

  test('When we get the history Then it succeeds', async () => {
    const result = await target.getCoinHistory(
      coinId,
      new Date('2022-06-10'),
    )();

    expect(isRight(result)).toBeTruthy();
  });

  test('When we get the OHLC data Then it succeeds', async () => {
    const result = await target.getOhlc({
      coinId,
      vsCurrency,
      days,
    })();

    expect(isRight(result)).toBeTruthy();
  });

  test('When we get the token prices Then it succeeds', async () => {
    const result = await target.getPrices([
      '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4',
    ])();

    expect(isRight(result)).toBeTruthy();
  });

  test('When we get the coin list Then it succeeds', async () => {
    const result = await target.getCoinList()();

    expect(isRight(result)).toBeTruthy();
  });

  test('When we get a lot of stuff Then the rate limit is satisfied', async () => {
    const repeats = 20;
    const start = new Date().getTime();
    for (let i = 0; i < repeats; i++) {
      await target.getCoinHistory('ethereum', new Date())();
    }
    const end = new Date().getTime();

    const diff = end - start;

    expect(diff).toBeGreaterThanOrEqual(repeats * CG_RATE_LIMIT);
  });
});
