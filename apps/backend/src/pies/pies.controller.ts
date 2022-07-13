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
import moment from 'moment';
import { CallMonitorService } from '../monitoring';
import { SliceDoughRatioDto } from './dto/SliceDoughRatioDto';
import { CgCoinEntity } from './entities/cg_coin.entity';
import { PieHistoryEntity } from './entities/pie-history.entity';
import { PieEntity } from './entities/pie.entity';
import { PiesService } from './pies.service';

@ApiTags('Pies')
@Controller('pies')
export class PiesController {
  constructor(
    private readonly piesService: PiesService,
    private readonly callMonitorService: CallMonitorService,
  ) {}

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
      const { result } = await this.callMonitorService.monitorAsyncRuntimeOf(
        'getPies',
        () => this.piesService.getPies(name, address),
        {
          name,
          address,
        },
      );
      return result;
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
      const { result } = await this.callMonitorService.monitorAsyncRuntimeOf(
        'getSliceDoughRatio',
        () => this.piesService.getSliceDoughRatio(),
      );
      return {
        value: result,
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

      const { result } = await this.callMonitorService.monitorAsyncRuntimeOf(
        'getMarketChart',
        () => this.piesService.getMarketChart(address, days),
        {
          address,
          days,
        },
      );

      return result;
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

      const projection = {
        'coin.symbol': 1,
        'coin.contract_address': 1,
        'coin.market_data.current_price.usd': 1,
        'coin.market_data.price_change_percentage_24h': 1,
        'coin.market_data.price_change_percentage_30d': 1,
      };

      const { result } = await this.callMonitorService.monitorAsyncRuntimeOf(
        'getCgCoin',
        () =>
          this.piesService.getCgCoin(
            address,
            from,
            to,
            order,
            limit,
            projection,
          ),
        { address, from, to, order, limit, projection },
      );

      return result;
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

      const { result } = await this.callMonitorService.monitorAsyncRuntimeOf(
        'getPieHistory',
        () =>
          this.piesService.getPieHistory(name, address, from, to, order, limit),
        { name, address, from, to, order, limit },
      );

      return result;
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

      const { result: data } =
        await this.callMonitorService.monitorAsyncRuntimeOf(
          'getPieHistory7Days',
          () =>
            this.piesService.getPieHistory(
              undefined,
              address,
              from.toString(),
              undefined,
              'descending',
              0,
            ),
          { address },
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
      const { result } = await this.callMonitorService.monitorAsyncRuntimeOf(
        'getLastPieHistory',
        () =>
          this.piesService.getPieHistory(
            name,
            address,
            null,
            null,
            'descending',
            1,
          ),
        { name, address },
      );
      return result;
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
      const { result } = await this.callMonitorService.monitorAsyncRuntimeOf(
        'getPieByAddress',
        () => this.piesService.getPieByAddress(address),
        { address },
      );
      return result;
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
      const { result } = await this.callMonitorService.monitorAsyncRuntimeOf(
        'getPieByName',
        () => this.piesService.getPieByName(name),
        { name },
      );
      return result;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
