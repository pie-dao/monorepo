import { Injectable } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import { Severity } from '@sentry/types';
import now from 'performance-now';

export type RuntimeResult<T> = {
  result: T;
  runtimeMs: number;
};

@Injectable()
export class CallMonitorService {
  private sentry: ReturnType<SentryService['instance']>;
  private warningThresholdMs: number = 1000 * 8;

  constructor(private sentryService: SentryService) {
    this.sentry = this.sentryService.instance();
  }

  monitorRuntimeOf<T>(
    name: string,
    call: () => T,
    params: Record<string, unknown> = {},
    reportToSentry = true,
  ): RuntimeResult<T> {
    const start = now();
    const result = call();
    const end = now();
    const runtimeMs = end - start;
    if (runtimeMs > this.warningThresholdMs) {
      if (reportToSentry) {
        this.sentry.captureMessage(
          `${name} with params ${JSON.stringify(params)} took ${runtimeMs}ms`,
          Severity.Error,
        );
      }
    }
    return {
      result,
      runtimeMs,
    };
  }

  async monitorAsyncRuntimeOf<T>(
    name: string,
    call: () => Promise<T>,
    params: Record<string, unknown> = {},
    reportToSentry = true,
  ): Promise<RuntimeResult<T>> {
    const start = now();
    const result = await call();
    const end = now();
    const runtimeMs = end - start;
    if (reportToSentry) {
      this.sentry.captureMessage(
        `${name} with params ${JSON.stringify(params)} took ${runtimeMs}ms`,
        Severity.Error,
      );
    }
    return {
      result,
      runtimeMs,
    };
  }
}
