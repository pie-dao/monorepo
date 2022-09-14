import { isRight } from 'fp-ts/lib/Either';
import { TheGraphAdapter } from '.';

const coinId = '0xe4f726adc8e89c6a6017f01eada77865db22da14';

jest.setTimeout(60 * 1000);

describe('Given a The Graph adapter', () => {
  let target: TheGraphAdapter;

  beforeAll(() => {
    target = new TheGraphAdapter();
  });

  test('When we pass an address then it succeeds', async () => {
    const result = await target.getTheGraphData(coinId)();

    expect(isRight(result)).toBeTruthy();
  });
});
