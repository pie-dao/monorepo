import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SliceDoughRatioDto } from './dto/SliceDoughRatioDto';
import { CgCoinEntity } from './entities/cg_coin.entity';
import { PieHistoryEntity } from './entities/pie-history.entity';
import { PieEntity } from './entities/pie.entity';
import { PiesService } from './pies.service';
import * as moment from 'moment';

@ApiTags('Pies')
@Controller('pies')
export class PiesController {
  constructor(private readonly piesService: PiesService) {}

  @ApiOkResponse({ type: PieEntity, isArray: true })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'address', required: false })
  @Get('all')
  async getPies(
    @Query('name') name?: string,
    @Query('address') address?: string,
  ): Promise<PieEntity[]> {
    try {
      return await this.piesService.getPies(name, address);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({ type: SliceDoughRatioDto, isArray: false })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Get('slice-dough-ratio')
  async getSliceDoughRatio(): Promise<SliceDoughRatioDto> {
    try {
      return {
        value: await this.piesService.getSliceDoughRatio(),
      };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({ type: PieHistoryEntity, isArray: true })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'address', required: true })
  @ApiQuery({ name: 'days', required: false })
  @Get('market_chart')
  async getMarketChart(
    @Query('address') address: string,
    @Query('days') days?: number,
  ): Promise<any> {
    try {
      if (days === undefined) {
        days = 90;
      }

      return await this.piesService.getMarketChart(address, days);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({ type: PieHistoryEntity, isArray: true })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'order', required: false })
  @Get('coin')
  async getCgCoin(
    @Query('address') address?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: number,
    @Query('order') order?: 'descending' | 'ascending',
  ): Promise<CgCoinEntity[]> {
    try {
      if (order === undefined) {
        order = 'descending';
      }

      if (limit === undefined) {
        limit = 0;
      }

      return await this.piesService.getCgCoin(address, from, to, order, limit);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({ type: PieHistoryEntity, isArray: true })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'order', required: false })
  @Get('history')
  async getPieHistory(
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: number,
    @Query('order') order?: 'descending' | 'ascending',
  ): Promise<any> {
    try {
      if (order === undefined) {
        order = 'descending';
      }

      if (limit === undefined) {
        limit = 0;
      }

      return await this.piesService.getPieHistory(
        name,
        address,
        from,
        to,
        order,
        limit,
      );
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({ type: PieHistoryEntity, isArray: true })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'address', required: true })
  @Get('history_7_days')
  async getPieHistory7Days(@Query('address') address: string): Promise<any> {
    try {
      const from = moment(new Date()).subtract(7, 'days').toDate().getTime();

      const data = await this.piesService.getPieHistory(
        undefined,
        address,
        from.toString(),
        undefined,
        'descending',
        0,
      );

      const history: PieHistoryEntity[] = [];
      const days: Date[] = [];

      for (let i = 0; i < 7; i++) {
        days.push(moment(new Date()).subtract(i, 'days').toDate());
      }
      let idx = 0;

      let next = days[idx].getTime();
      for (const record of data.history) {
        if (Number(record.timestamp) < next) {
          idx++;
          next = days[idx]?.getTime() ?? 0;
          history.push(record);
        }
        if (idx >= days.length) {
          break;
        }
      }

      return {
        pie: data.pie,
        history: history,
      };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({ type: PieHistoryEntity, isArray: true })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'address', required: false })
  @Get('latest-history')
  async getLastPieHistory(
    @Query('name') name?: string,
    @Query('address') address?: string,
  ): Promise<any> {
    try {
      return await this.piesService.getPieHistory(
        name,
        address,
        null,
        null,
        'descending',
        1,
      );
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({ type: PieEntity, isArray: false })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Get('address/:address')
  async getPieByAddress(@Param('address') address: string): Promise<PieEntity> {
    try {
      return await this.piesService.getPieByAddress(address);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @ApiOkResponse({ type: PieEntity, isArray: false })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Get('name/:name')
  async getPieByName(@Param('name') name: string): Promise<PieEntity> {
    try {
      return await this.piesService.getPieByName(name);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
