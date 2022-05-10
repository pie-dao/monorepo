import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getKpiAirdrop(blockNumber: number): Promise<Object>;
}
