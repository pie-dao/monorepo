import { Module } from '@nestjs/common';
import { PiesModule } from 'src/pies/pies.module';
import { BotController } from './bot.controller';
import { BotServiceImpl } from './bot.service';

@Module({
  controllers: [BotController],
  providers: [BotServiceImpl],
  exports: [BotServiceImpl],
  imports: [PiesModule],
})
export class BotModule {}
