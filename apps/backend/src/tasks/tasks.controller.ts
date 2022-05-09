import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOkResponse({type: Object, isArray: true})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'blockNumber', required: true})
  @Get('kpi-airdrop')
  async getKpiAirdrop(@Query('blockNumber') blockNumber: number): Promise<Object> {
    try {
      return await this.tasksService.getKpiAirdrop(blockNumber);
    } catch(error) {
      /* istanbul ignore next */
      throw new NotFoundException(error);
    }
  }
}