import { Module } from '@nestjs/common';
import { FundsController } from './';

@Module({
  imports: [],
  controllers: [FundsController],
  providers: [],
  exports: [],
})
export class PiesModule {}
