import { SupportedChain } from '@shared/util-types';
import { YieldData } from '../../Strategy';
import { Token } from '../../Token';
import { YieldVaultStrategy } from '../YieldVaultStrategy';

export class TestStrategy implements YieldVaultStrategy {
  public kind = 'test';

  constructor(
    public chain: SupportedChain,
    public address: string,
    public name: string,
    public underlyingToken: Token,
    public trusted: boolean,
    public vaults: string[] = [],
    public yields: YieldData[] = [],
  ) {}

  calculateAPR(): number {
    return 0;
  }

  simulateAPY(compoundingFrequency: number): number {
    return 0;
  }
}
