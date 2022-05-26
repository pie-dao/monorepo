import React from 'react';
import { setImmediate, clearImmediate } from 'timers';
import { render } from '@testing-library/react';
import { generateTestingUtils } from 'eth-testing';
import { ConnectButton } from './ConnectButton';
import { assertConnectButton } from '../test-utils/interactions';

const trimAccount = (account: string): string => {
  return account.slice(0, 6) + '...' + account.slice(38);
};

jest.mock('@web3-react/core', () => {
  return {
    ...jest.requireActual('@web3-react/core'),
    useWeb3React: jest.fn().mockReturnValue({
      active: true,
      error: undefined,
      account: '0xA6d6126Ad67F6A64112FD875523AC20794e805af',
      chainId: 1,
      activate: jest.fn(),
      deactivate: jest.fn(),
      setError: jest.fn(),
    }),
  };
});

const metaMaskTestingUtils = generateTestingUtils({ providerType: 'MetaMask' });

let originalEth: unknown;

beforeAll(() => {
  originalEth = global.window.ethereum;
  // @ts-expect-error
  window.ethereum = metaMaskTestingUtils.getProvider();

  jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation(setImmediate as any);
  jest
    .spyOn(window, 'cancelAnimationFrame')
    .mockImplementation(clearImmediate as any);
});

afterAll(() => jest.restoreAllMocks());

describe('Rendering', () => {
  describe('Connect Button', () => {
    it('should be possible to see the wallet address', async () => {
      render(<ConnectButton />);
      assertConnectButton({
        textContent: trimAccount('0xA6d6126Ad67F6A64112FD875523AC20794e805af'),
      });
    });
  });
});
