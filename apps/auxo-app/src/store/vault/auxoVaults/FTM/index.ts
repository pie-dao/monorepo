import DAI from './DAI';
import USDC from './USDC';
import FRAX from './FRAX';
import wFTM from './wFTM';
import MIM from './MIM'
import { Vault } from '../../Vault';

export const FTM: Vault[] = [DAI, USDC, FRAX, wFTM, MIM].map((vault, id) => ({ id, ...vault }));