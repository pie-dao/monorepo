import { Erc20Abi } from '@shared/util-blockchain';
import { erc20 } from '@shared/util-blockchain/abis';
import { ethers } from 'ethers';
// eslint-disable-next-line
import { SUPPORTED_CHAINS } from 'libs/shared/util-blockchain/chains';
import { MultiChainContractWrapper } from '../sdk-utils-multichain';
import { MultiChainConfigOverrides } from '../sdk-utils-multichain';

describe('Different ways to make multichain calls', () => {
  jest.setTimeout(20_000);

  const multichainConfigWrapper = {
    [SUPPORTED_CHAINS.ETHEREUM]: {
      provider: new ethers.providers.JsonRpcProvider(
        'https://rpc.ankr.com/eth',
      ),
    },
    [SUPPORTED_CHAINS.POLYGON]: {
      provider: new ethers.providers.JsonRpcProvider('https://polygon-rpc.com'),
    },
    [SUPPORTED_CHAINS.OPTIMISM]: {
      provider: new ethers.providers.JsonRpcProvider(
        'https://mainnet.optimism.io',
      ),
    },
  };

  const USDT_OVERRIDES: MultiChainConfigOverrides = {
    [SUPPORTED_CHAINS.OPTIMISM]: {
      address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      exclude: false,
    },
    [SUPPORTED_CHAINS.ETHEREUM]: {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      exclude: true,
    },
    [SUPPORTED_CHAINS.POLYGON]: {
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      exclude: true,
    },
  };

  const multichain = new MultiChainContractWrapper(multichainConfigWrapper);

  const usdt = multichain.create<Erc20Abi>(
    USDT_OVERRIDES[SUPPORTED_CHAINS.POLYGON].address!,
    erc20,
    multichainConfigWrapper[SUPPORTED_CHAINS.POLYGON].provider,
    USDT_OVERRIDES,
  );

  const usdtOnlyEth = multichain.wrap(usdt, {
    ...USDT_OVERRIDES,
    ...{
      [SUPPORTED_CHAINS.ETHEREUM]: {
        exclude: false,
      },
      [SUPPORTED_CHAINS.POLYGON]: {
        exclude: false,
      },
    },
  });

  it('Allows a per-call override of the contract address', async () => {
    expect(usdt._multichainConfig).toBeTruthy();
    expect(usdt._multichainConfig![1].exclude).toBe(true);
    expect(usdt._multichainConfig![11].exclude).toBe(false);

    expect(usdtOnlyEth._multichainConfig).toBeTruthy();
    expect(usdtOnlyEth._multichainConfig![1].exclude).toBe(false);
    expect(usdtOnlyEth._multichainConfig![137].exclude).toBe(false);
    expect(usdtOnlyEth._multichainConfig![11].exclude).toBe(false);
  });

  it('Preserves the contract overrides once wrapped', async () => {
    // not implemented
  });

  it('Returns a meta across all calls', async () => {
    // not implemented
  });

  it('Correctly calcs errors', async () => {
    // not implemented
  });
});
