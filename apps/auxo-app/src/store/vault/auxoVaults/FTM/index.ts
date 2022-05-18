import DAI from './DAI';
import USDC from './USDC';
import FRAX from './FRAX';
import WFTM from './WFTM';
import MIM from './MIM';
import { Vault } from '../../Vault';
import { SUPPORTED_CHAINS } from '../../../../utils/networks';

// instantiate top level vault info here
export const FTM: Vault[] = [DAI, USDC, FRAX, WFTM, MIM].map((vault) => ({
  network: {
    name: 'FANTOM',
    chainId: SUPPORTED_CHAINS.FANTOM,
    multicall: '0x6c31De530342b4F6681B2fE7c420248b920A63A2',
  },
  ...vault,
}));
