import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EpochEntity } from '../entities/epoch.entity';
import { StakingController } from '../staking.controller';
import { StakingService } from '../staking.service';
import { EpochsStub } from './stubs/epochs.stubs';
import { LocksStub } from './stubs/locks.stubs';
import { StakersStub } from './stubs/stakers.stubs';

jest.mock('../staking.service');

describe('StakingController', () => {
  let controller: StakingController;
  let service: StakingService;

  let blockNumber = 13527858;
  let month = 10;
  let distributedRewards = "1350000";
  let windowIndex = 0;
  let proposals = "QmRkF9A2NigXcBBFfASnM7akNvAo6c9jgNxpt1faX6hvjK,QmebDo3uTVJ5bHWgYhf7CvcK7by1da1WUX4jw5uX6M7EUW,QmRakdstZdU1Mx1vYhjon8tYnv5o1dkir8v3HDBmmnCGUc";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StakingController],
      providers: [StakingService],
    }).compile();

    controller = module.get<StakingController>(StakingController);
    service = module.get<StakingService>(StakingService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStakers', () => {
    describe('When getStakers is called', () => {
      let stakers: any[];

      beforeEach(async () => {
        stakers = await controller.getStakers();
      });

      test('then it should call stakingService.getStakers', () => {
        expect(service.getStakers).toHaveBeenCalled();
      });

      test('then it should return an array of Stakers', () => {
        expect(stakers).toEqual(StakersStub());
      });     

      test('it should throw an error if no records are found', async() => {
        await expect(controller.getStakers("not, existing, ids"))
        .rejects
        .toThrow(NotFoundException);
      });      
    });
  }); 
  
  describe('getLocks', () => {
    describe('When getLocks is called', () => {
      let locks: any[];

      beforeEach(async () => {
        locks = await controller.getLocks();
      });

      test('then it should call stakingService.getLocks', () => {
        expect(service.getLocks).toHaveBeenCalled();
      });

      test('then it should return an array of Locks', () => {
        expect(locks).toEqual(LocksStub());
      });     

      test('it should throw an error if no records are found', async() => {
        await expect(controller.getLocks(undefined, "not, existing, ids"))
        .rejects
        .toThrow(NotFoundException);
      });      
    });
  });  
  
  describe('getEpoch', () => {
    describe('When getEpoch is called', () => {
      let epoch: EpochEntity;

      beforeEach(async () => {
        epoch = await controller.getEpoch(windowIndex);
      });

      test('then it should call stakingService.getEpoch', () => {
        expect(service.getEpoch).toHaveBeenCalled();
      });

      test('then it should return an Epoch', () => {
        let epochs = EpochsStub();
        expect(epoch).toEqual(epochs[epochs.length - 1]);
      });   
      
      test('it should throw an error if no records are found', async() => {
        await expect(controller.getEpoch())
        .rejects
        .toThrow(NotFoundException);
      });      
    });
  });

  describe('getEpochs', () => {
    describe('When getEpochs is called', () => {
      let epochs: EpochEntity[];

      beforeEach(async () => {
        epochs = await controller.getEpochs(Date.now());
      });

      test('then it should call stakingService.getEpochs', () => {
        expect(service.getEpochs).toHaveBeenCalled();
      });

      test('then it should return an array of EpochEntity', () => {
        expect(epochs).toEqual(EpochsStub());
      }); 
      
      test('it should throw an error if no records are found', async() => {
        await expect(controller.getEpochs())
        .rejects
        .toThrow(NotFoundException);
      });       
    });
  });   

  describe('getFreeRiders', () => {
    describe('When getFreeRiders is called', () => {
      let freeRiders: any;

      beforeEach(async() => {
        freeRiders = await controller.getFreeRiders(month, blockNumber, proposals); 
      });

      test('it should call stakingService.getFreeRiders()', () => {
        let proposalsIds = proposals.split(",").map(id => '"' + id + '"');
        expect(service.getFreeRiders).toHaveBeenCalledWith(month, blockNumber, proposalsIds);
      });

      test('it should throw an error if no records are found', async() => {
        await expect(controller.getFreeRiders())
        .rejects
        .toThrow(NotFoundException);
      });      
    });
  });

});
