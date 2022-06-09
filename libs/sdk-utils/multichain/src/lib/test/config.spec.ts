import { ethers } from 'ethers';
import { MultiChainContractWrapper } from '../sdk-utils-multichain';

describe('Testing configuration options for multichain', () => {
  describe('Testing passing different provider options', () => {
    it('Allows passing of chain ids with fallback providers', () => {});

    it('Allows passing of providers', () => {});

    it('Allows passing of RPC URLs', () => {});

    it('Throws an error if a chain id is passed, but no provider exists', () => {});
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

  describe('Testing error handling options', () => {
    it('Allows us to set global error handling as silent', () => {});

    it('Allows us to set global error handling to crash the runtime', () => {});

    it('Allows us to set per chain error handling as silent', () => {});

    it('Allows us to set per chain error handling to crash the runtime', () => {});
  });
});
