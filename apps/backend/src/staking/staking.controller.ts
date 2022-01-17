import { Controller, Get, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EpochEntity } from './entities/epoch.entity';
import { StakingService } from './staking.service';
import { FreeRider } from './types/staking.types.FreeRider';

@ApiTags('Staking')
@Controller('staking')
export class StakingController {
  constructor(private readonly stakingService: StakingService) {}

  @ApiOkResponse({type: Array, isArray: true})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'ids', required: false})
  @Get('stakers')
  async getStakers(@Query('ids') ids?: string): Promise<any[]> {
    try {
      let stakersIds = null;

      if(ids) {
        stakersIds = ids.split(",").map(id => '"' + id + '"');
      }

      return await this.stakingService.getStakers(stakersIds);
    } catch(error) {
      throw new NotFoundException(error);
    }
  };

  @ApiOkResponse({type: Array, isArray: true})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'locked_at', required: false})
  @ApiQuery({name: 'ids', required: false})
  @Get('locks')
  async getLocks(@Query('locked_at') locked_at?: string, @Query('ids') ids?: string): Promise<any[]> {
    try {
      let stakersIds = null;

      if(ids) {
        stakersIds = ids.split(",").map(id => '"' + id + '"');
      }

      return await this.stakingService.getLocks(locked_at, stakersIds);
    } catch(error) {
      throw new NotFoundException(error);
    }
  };

  @ApiOkResponse({type: EpochEntity, isArray: true})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'startDate', required: false})
  @Get('epochs')
  async getEpochs(@Query('startDate') startDate?: number): Promise<Array<EpochEntity>> {
    try {
      return await this.stakingService.getEpochs(startDate);
    } catch(error) {
      throw new NotFoundException(error);
    }
  };

  @ApiOkResponse({type: EpochEntity})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'windowIndex', required: false})
  @Get('epoch')
  async getEpoch(@Query('windowIndex') windowIndex?: number): Promise<EpochEntity> {
    try {
      return await this.stakingService.getEpoch(windowIndex);
    } catch(error) {
      throw new NotFoundException(error);
    }
  };

  @ApiOkResponse({type: Object, isArray: false})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'month', required: true})
  @ApiQuery({name: 'blockNumber', required: true})
  @ApiQuery({name: 'proposals', required: true, isArray: true})
  @Get('free-riders')
  async getFreeRiders(
    @Query('month') month?: number,
    @Query('blockNumber') blockNumber?: number,
    @Query('proposals') proposals?: string    
  ): Promise<FreeRider[]> {
    try {
      if(month === undefined || blockNumber === undefined) {
        throw new InternalServerErrorException({error: "month / blockNumber are mandatory params."}, null);
      }

      /* istanbul ignore next */
      let proposalsIds = proposals ? proposals.split(",").map(id => '"' + id + '"') : null;  

      return await this.stakingService.getFreeRiders(month, blockNumber, proposalsIds);
    } catch(error) {
      /* istanbul ignore next */
      throw new NotFoundException(error);
    }
  };
}