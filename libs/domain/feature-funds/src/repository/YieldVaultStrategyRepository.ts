import {
  DatabaseError,
  EntityNotFoundError,
  QueryOptions,
  Repository,
  SupportedChain,
} from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';
import { YieldData, YieldVaultStrategy } from '../fund';
import { ContractParams } from './ContractParams';

export class CreateYieldError extends Error {
  public kind: 'CreateYieldError' = 'CreateYieldError';
  constructor(public message: string) {
    super(`Saving yield entry failed: ${message}`);
  }
}

export interface YieldVaultStrategyRepository<
  S extends YieldVaultStrategy,
  F extends QueryOptions = QueryOptions,
> extends Repository<ContractParams, S, F> {
  /**
   * Adds a yield data entry for the strategy with the given `chain` and `address`.
   */
  addYieldData(
    chain: SupportedChain,
    address: string,
    entry: YieldData,
  ): TE.TaskEither<
    EntityNotFoundError | CreateYieldError | DatabaseError,
    YieldData
  >;
}
