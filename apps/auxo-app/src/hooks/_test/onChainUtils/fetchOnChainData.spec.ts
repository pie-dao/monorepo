import { vaults } from '../../../store/vault/auxoVaults';
import * as utils from '../../../utils/promiseObject';
import * as f from '../../onChainUtils/fetchOnChainData';
import { Vault as Auxo } from '../../../types/artifacts/abi';

describe('Testing calling onchain data', () => {
  let [spyPromise] = [] as Array<jest.SpyInstance>;
  const auxo = undefined;
  const auth = undefined;
  const token = undefined;
  const account = null;
  const batchBurnRound = 0;
  const vault = vaults[0];

  beforeEach(() => {
    spyPromise = jest.spyOn(utils, 'promiseObject').mockResolvedValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns nothing if the contracts are missing', async () => {
    await f.fetchOnChainData({
      token,
      auxo,
      auth,
      account,
      batchBurnRound,
      vault,
    });
    expect(spyPromise).not.toHaveBeenCalled();
  });

  it('Calls the batch burn only if we have a batch burn > 0', async () => {
    let expectUndefined = f.batchBurnCalls(auxo as unknown as Auxo, undefined);
    expect(expectUndefined).toEqual(undefined);
    expectUndefined = f.batchBurnCalls(auxo as unknown as Auxo, 0);
    expect(expectUndefined).toEqual(undefined);
  });
});
