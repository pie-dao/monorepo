import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TreasuryController } from '../treasury.controller';
import { TreasuryService } from '../treasury.service';

jest.mock('../treasury.service');

describe('TreasuryController', () => {
  let controller: TreasuryController;
  let service: TreasuryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreasuryController],
      providers: [TreasuryService],
    }).compile();

    controller = module.get<TreasuryController>(TreasuryController);
    service = module.get<TreasuryService>(TreasuryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTreasury', () => {
    it('should call the treasury service', async () => {
      await controller.getTreasury({ days: 1 });
      expect(service.getTreasury).toHaveBeenCalled();
    });

    it('it should return an array of treasuries', async () => {
      jest
        .spyOn(service, 'getTreasury')
        .mockImplementationOnce(() => Promise.resolve([]));
      const treasuries = await controller.getTreasury({ days: 1 });
      expect(treasuries).toEqual([]);
    });

    it('should throw a NotFoundException if get treasury rejects', async () => {
      jest
        .spyOn(service, 'getTreasury')
        .mockImplementationOnce(() => Promise.reject());
      await expect(controller.getTreasury({ days: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
