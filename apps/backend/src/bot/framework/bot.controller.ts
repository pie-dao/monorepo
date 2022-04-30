import { Controller } from '@nestjs/common';
import { BotServiceImpl } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotServiceImpl) {}
}
