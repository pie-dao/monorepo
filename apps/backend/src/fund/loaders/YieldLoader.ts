import { CompoundingFrequency } from '@domain/feature-funds';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { MongoYieldVaultStrategyRepository } from '../repository';
import { ONE_DAY } from './constants';

@Injectable()
export class YieldLoader {
  private sentry: ReturnType<SentryService['instance']>;
  constructor(
    private strategyRepository: MongoYieldVaultStrategyRepository,
    @InjectSentry()
    private sentryService: SentryService,
  ) {
    this.sentry = this.sentryService.instance();
  }

  @Interval(ONE_DAY)
  public updateYields() {
    Logger.log('Updating strategy yields...');
    return pipe(
      TE.fromTask(this.strategyRepository.find()),
      TE.chainW(
        TE.traverseArray((strategy) => {
          const compoundingFrequency = CompoundingFrequency.DAILY;
          return pipe(
            strategy.simulateAPY(compoundingFrequency, 1),
            TE.map(({ totalAPR, totalAPY }) => {
              return this.strategyRepository.addYieldData(
                strategy.chain,
                strategy.address,
                {
                  apr: totalAPR,
                  timestamp: new Date(),
                  apy: { compoundingFrequency, value: totalAPY },
                },
              );
            }),
          );
        }),
      ),
      TE.bimap(
        (error) => {
          this.sentry.captureException(error);
          Logger.error(error);
          return error;
        },
        (result) => {
          Logger.log('Strategy yields updated successfully.');
          return result;
        },
      ),
    );
  }
}
