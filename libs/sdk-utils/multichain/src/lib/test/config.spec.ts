import { typesafeContract } from '@sdk-utils/core';
import { MultiCallWrapper } from '@sdk-utils/multicall';
import { SmartpoolAbi } from '@shared/util-blockchain';
import { smartPool } from '@shared/util-blockchain/abis';
import { ethers } from 'ethers';
import { MultiChainContractWrapper } from '../sdk-utils-multichain';

describe('Testing configuration options for multichain', () => {
  describe('Testing passing different provider options', () => {
    it('Allows passing of chain ids with fallback providers', () => {
      // Not implemented
    });

    it('Allows passing of providers', () => {
      const { multicallProvider } = new MultiCallWrapper();

      const baseConfig = {
        [1]: {
          provider: ethers.getDefaultProvider(),
        },
      };
      const multichain = new MultiChainContractWrapper(baseConfig);
      const contract = typesafeContract<SmartpoolAbi>(
        '0x8d1ce361eb68e9e05573443c407d4a3bed23b033',
        smartPool.abi,
      );
      const wrapped = multichain.wrap(contract);

      expect(wrapped._multichainConfig![1].provider).toEqual(
        baseConfig[1].provider,
      );

      const newContract = multichain.wrap(contract, {
        [1]: {
          provider: multicallProvider,
        },
      });

      expect(newContract._multichainConfig![1].provider).toEqual(
        multicallProvider,
      );
    });

    it('Allows passing of RPC URLs', () => {
      // Not implemented
    });

    it('Throws an error if a chain id is passed, but no provider exists', () => {
      // Not implemented
    });
  });

  describe('Adding overrides', () => {
    const baseConfig = {
      [1]: {
        provider: ethers.providers.getDefaultProvider(),
        exclude: false,
      },
      [250]: {
        provider: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools'),
        exclude: true,
      },
    };
    const mc = new MultiChainContractWrapper(baseConfig);

    it('Defaults to the standard config settings', () => {
      expect(mc.config).toEqual(baseConfig);
    });

    it('Applies overrides if passed', () => {
      const override = {
        [250]: {
          exclude: false,
          address: '',
        },
      };

      const newConfig = mc.combineConfigAndOverrides(override);

      expect(newConfig![250].exclude).toEqual(false);
      expect(newConfig![250].provider).toEqual(baseConfig[250].provider);
      expect(newConfig![1].provider).toEqual(baseConfig[1].provider);
    });

    it('Applies no overrides if passed a blank overrides object', () => {
      const override = {};
      const newConfig = mc.combineConfigAndOverrides(override);
      expect(newConfig).toEqual(baseConfig);

      const override2 = {
        [250]: {},
      };
      const newConfig2 = mc.combineConfigAndOverrides(override2);
      expect(newConfig2).toEqual(baseConfig);
    });
  });
});
