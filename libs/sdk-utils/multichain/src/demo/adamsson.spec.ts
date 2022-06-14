import { ethers } from 'ethers';
import { SUPPORTED_CHAINS } from 'libs/shared/util-blockchain/chains';
import {
  MultiChainConfigOverrides,
  MultiChainContractWrapper,
  MultiChainWrapperConfig,
} from '../lib/sdk-utils-multichain';
import { erc20 } from '@shared/util-blockchain/abis';
import { Erc20Abi } from '@shared/util-blockchain';
import * as _0x from '@0xsequence/multicall';

/**
 * Features:
 *  -- Factory functions for common providers (multicall jsonrpc generator)
 *  -- Enum for common addresses (stables, WETH, USDT, USDC, DAI)
 *  -- check exclude true on all responses
 *  -- One stop integration for multicall and multichain
 */

describe('A test of the multichain for Adammsson', () => {
  it('Works', async () => {
    const ethProvider = new ethers.providers.JsonRpcProvider(
      'https://rpc.ankr.com/eth',
    );

    const polygonProvider = new ethers.providers.JsonRpcProvider(
      'https://polygon-rpc.com',
    );

    const multicallMainnetProvider = new _0x.providers.MulticallProvider(
      ethProvider,
    );
    const multicallPolygonProvider = new _0x.providers.MulticallProvider(
      polygonProvider,
    );

    const config: MultiChainWrapperConfig = {
      [SUPPORTED_CHAINS.ETHEREUM]: {
        provider: multicallMainnetProvider,
      },
      [SUPPORTED_CHAINS.POLYGON]: {
        provider: multicallPolygonProvider,
      },
    };

    // setup the wrapper
    const mcw = new MultiChainContractWrapper(config);

    const erc20Contract = new ethers.Contract(
      '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT mainnet,
      erc20, // abi
      multicallMainnetProvider, // provider/signer
    ) as Erc20Abi;

    const contractBalanceOfNull = await erc20Contract.balanceOf(
      ethers.constants.AddressZero,
    );

    console.log('Balance', contractBalanceOfNull.toString());

    const configOverrides: MultiChainConfigOverrides = {
      [SUPPORTED_CHAINS.POLYGON]: {
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8',
      },
    };

    const wrappedErc20Contract = mcw.wrap(erc20Contract, configOverrides);

    const wrappedContractbalanceOfNull = await wrappedErc20Contract.balanceOf(
      ethers.constants.AddressZero,
    );

    console.log('Balance', wrappedContractbalanceOfNull.toString());

    const multichainErc20Responses = await Promise.all([
      wrappedErc20Contract.multichain.balanceOf(ethers.constants.AddressZero),
      wrappedErc20Contract.multichain.balanceOf(ethers.constants.AddressZero),
    ]);

    console.log({ multichainErc20Responses });

    console.log(
      'Multichain Res on Eth',
      multichainErc20Responses[0].data[1],
      'Polygon',
      multichainErc20Responses[0].data[137],
    );

    if (multichainErc20Responses[0].data[1].status === 'fulfilled') {
      console.log(multichainErc20Responses[0].data[1].value.toString());
    }
  });
});
