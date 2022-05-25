import { act, renderHook } from '@testing-library/react-hooks';
import { useBlock } from '../useBlock';

class MockLibrary {
  constructor(public currentBlock = 100) {}
  public on(listener: string) {
    return () => {
      const block = this.currentBlock;
      this.currentBlock += 100;
      return block;
    };
  }
  public removeListener() {}

  public getBlockNumber(): Promise<number> {
    return new Promise((res) => res(this.currentBlock));
  }
}

const mockLib = new MockLibrary(100) as any;

jest.mock('../useCachedWeb3', () => ({
  useWeb3Cache: () => ({ chainId: 250 }),
}));

jest.mock('@web3-react/core', () => ({
  useWeb3React: () => ({ library: mockLib }),
}));

describe('testing fetching blocks', () => {
  it('gets the current block', async () => {
    const expectedBlock = 100;
    let [first, second] = [] as Array<number | null | undefined>;
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(() => useBlock());
      first = result.current.block.number;
      await waitForNextUpdate();
      second = result.current.block.number;
    });
    expect(first).toEqual(null);
    expect(second).toEqual(expectedBlock);
  });
});
