import { Get, NotFoundException, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { TreasuryService } from './treasury.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TreasuryEntity } from './entities/treasury.entity';
import { GetTreasuryQuery } from './dto/getTreasury.dto';

@ApiTags('Treasury')
@Controller('treasury')
export class TreasuryController {
  constructor(private readonly treasuryService: TreasuryService) {}

  @ApiOkResponse({ type: TreasuryEntity, isArray: true })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days of data to fetch, defaults to 7',
  })
  @Get()
  async getTreasury(
    @Query() params: GetTreasuryQuery,
  ): Promise<TreasuryEntity[]> {
    try {
      return await this.treasuryService.getTreasury(params.days);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
