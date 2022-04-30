import { Body, Get, NotFoundException, Param } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PieDto } from './dto/pies.dto';
import { PieHistoryEntity } from './entities/pie-history.entity';
import { PieEntity } from './entities/pie.entity';
import { PiesService } from './pies.service';
import { CgCoinEntity } from './entities/cg_coin.entity';
import { SliceDoughRatioDto } from './dto/SliceDoughRatioDto';

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
