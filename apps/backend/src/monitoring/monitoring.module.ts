import { Module } from '@nestjs/common';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { CallMonitorService } from './callmonitor.service';

@Module({
  imports: [SentryModule],
  providers: [CallMonitorService],
  exports: [CallMonitorService],
})
export class MonitoringModule {}
