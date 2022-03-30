import { Module } from '@nestjs/common';
import { PiesModule } from 'src/pies/pies.module';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
  imports: [PiesModule],
})
export class BotModule {}
