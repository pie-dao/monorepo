import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
import { AirdropStub } from './stubs/airdrop.stubs';

jest.mock('../tasks.service');

describe('StakingController', () => {
  let controller: TasksController;
  let service: TasksService;

  let TESTING_BLOCK = 13352729;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getKpiAirdrop', () => {
    describe('When getKpiAirdrop is called', () => {
      let airdrop: any;

      beforeEach(async () => {
        airdrop = await controller.getKpiAirdrop(TESTING_BLOCK);
      });

      test('then it should call tasksService.getKpiAirdrop', () => {
        expect(service.getKpiAirdrop).toHaveBeenCalled();
      });

      test('then it should return an Airdrop object', () => {
        expect(airdrop).toEqual(AirdropStub());
      });
    });
  });  
});
