import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { HttpModule} from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
