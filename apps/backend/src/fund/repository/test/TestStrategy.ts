import {
  APRBreakdown,
  APYBreakdown,
  EthersError,
  StrategyCalculationError,
  Token,
  YieldData,
  YieldVaultStrategy,
} from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';

export const TEST_STRATEGY_KIND = 'test';

export class TestStrategy implements YieldVaultStrategy {
  public kind: string = TEST_STRATEGY_KIND;

  constructor(
    public chain: SupportedChain,
    public address: string,
    public name: string,
    public underlyingToken: Token,
    public trusted: boolean = true,
    public vaults: string[] = [],
    public yields: YieldData[] = [],
  ) {}

  calculateAPR(): TE.TaskEither<StrategyCalculationError, APRBreakdown> {
    return TE.left(new EthersError('Not implemented'));
  }

  simulateAPY(
    compoundingFrequency = 1,
    years = 1,
  ): TE.TaskEither<StrategyCalculationError, APYBreakdown> {
    return TE.left(new EthersError('Not implemented'));
  }
}
