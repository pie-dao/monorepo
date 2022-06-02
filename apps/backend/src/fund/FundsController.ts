import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Funds')
@Controller('funds')
export class FundsController {}
