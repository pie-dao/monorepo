import { Body, Get, NotFoundException, Param } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PieDto } from './dto/pies.dto';
import { PieHistoryEntity } from './entities/pie-history.entity';
import { PieEntity } from './entities/pie.entity';
import { PiesService } from './pies.service';

@ApiTags('Pies')
@Controller('pies')
export class PiesController {
  constructor(private readonly piesService: PiesService) {}

  @Get('updatenavs')
  async updateNavs(): Promise<boolean> {
    try {
      return await this.piesService.updateNAVs();
    } catch(error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({type: PieEntity, isArray: true})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'name', required: false})
  @ApiQuery({name: 'address', required: false})
  @Get('all')
  async getPies(@Query('name') name?: string, @Query('address') address?: string): Promise<PieEntity[]> {
    try {
      return await this.piesService.getPies(name, address);
    } catch(error) {
      throw new NotFoundException(error);
    }
  };

  @ApiOkResponse({type: PieHistoryEntity, isArray: true})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'name', required: false})
  @ApiQuery({name: 'address', required: false})
  @ApiQuery({name: 'timestamp', required: false})
  @ApiQuery({name: 'order', required: false})
  @Get('history')
  async getPieHistory(
    @Query('name') name?: string, 
    @Query('address') address?: string,
    @Query('timestamp') timestamp?: string,
    @Query('order') order?: 'descending' | 'ascending'
  ): Promise<PieHistoryEntity[]> {
    try {
      if(order === undefined) {
        order = 'descending';
      }

      return await this.piesService.getPieHistory(name, address, timestamp, order);
    } catch(error) {
      throw new NotFoundException(error);
    }
  };  

  @ApiOkResponse({type: PieEntity, isArray: false})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Get('address/:address')
  async getPieByAddress(@Param('address') address: string): Promise<PieEntity> {
    try {
      return await this.piesService.getPieByAddress(address);
    } catch(error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({type: PieEntity, isArray: false})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Get('name/:name')
  async getPieByName(@Param('name') name: string): Promise<PieEntity> {
    try {
      return await this.piesService.getPieByName(name);
    } catch(error) {
      throw new NotFoundException(error);
    }
  }
}
