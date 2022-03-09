import DAI from './DAI';
import USDC from './USDC';
import FRAX from './FRAX';
import wFTM from './wFTM';
import MIM from './MIM'
import { Vault } from '../../Vault';

// instantiate top level vault info here
export const FTM: Vault[] = [DAI, USDC, FRAX, wFTM, MIM]
    .map((vault) => ({
        network: {
            name: 'FANTOM',
            chainId: 250,
            multicall: '0x6c31De530342b4F6681B2fE7c420248b920A63A2'
        },
        ...vault,
    }
    ));