import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import {
  AssetEntity,
  TreasuryEntity,
  TreasurySchema,
} from '../entities/treasury.entity';
import { TreasuryService } from '../treasury.service';
import { balancesStub } from './stubs/balances.stub';
import { networkStub } from './stubs/network.stub';
import { notUsefulDataStub } from './stubs/notUsefulData.stub';
import { usefulDataStub, TREASURY_TOTAL } from './stubs/usefulData.stub';
import { AxiosResponse } from 'axios';

describe('Testing the treasury service', () => {
  const treasuryMockValue = {
    assets: 100,
    debt: 0,
    total: 100,
  };

  const assetMockValue: AssetEntity = {
    ...treasuryMockValue,
    network: networkStub[0].network,
    protocol: networkStub[0].apps[0].appId,
  };

  const recordMockValue: TreasuryEntity = {
    underlying_assets: [assetMockValue],
    treasury: treasuryMockValue.total,
  };

  const mockAxiosResponse: AxiosResponse = {
    data: {
      value: 'test',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  let service: TreasuryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_DB_TEST),
        MongooseModule.forFeature([
          { name: TreasuryEntity.name, schema: TreasurySchema },
        ]),
      ],
      providers: [TreasuryService],
    }).compile();

    service = module.get<TreasuryService>(TreasuryService);
    await service.treasuryModel.deleteMany({});
  });

  afterAll(async () => {
    await service.treasuryModel.deleteMany({});
  });

  describe('Testing the treasury service', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Testing the cronjob logic', () => {
    it('Throws a console error if there was a problem', async () => {
      const spy = jest.spyOn(service, 'loadTreasury');
      const consoleSpy = jest.spyOn(console, 'error');

      spy.mockImplementation(() => {
        throw new Error();
      });
      // silence error in jest console
      consoleSpy.mockImplementation(jest.fn());
      await service.createTreasuryRecord();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('correctly calculates the total', () => {
      const total = service.getTotal(usefulDataStub);
      expect(Math.floor(total.treasury)).toEqual(TREASURY_TOTAL);
    });

    it('Iterates over the networks returned', async () => {
      const spy = jest
        .spyOn(service, 'getNetworkBalance')
        .mockReturnValue(Promise.resolve([assetMockValue]));

      await service.getNetworkBalances(networkStub);
      expect(spy).toHaveBeenCalledTimes(networkStub.length);
    });

    it('Filters and flattens correctly', () => {
      const example = [[], [0], [], [0]] as unknown as AssetEntity[][];
      const filteredFlattened = service.getUnderlyingAssetsArray(example);
      expect(filteredFlattened).toEqual([0, 0]);
    });

    it('Returns a treasury record if we have an array of values returned', async () => {
      jest
        .spyOn(service, 'apiCall')
        .mockReturnValue(Promise.resolve(balancesStub));
      jest
        .spyOn(service, 'extractTreasuryValues')
        .mockReturnValue(treasuryMockValue);
      const record = await service.getBalanceSummary(networkStub[0]);
      expect(record[0]).toEqual(assetMockValue);
    });

    it('Does not return treasury record if we do not have an array of values returned', async () => {
      jest
        .spyOn(service, 'apiCall')
        .mockReturnValue(Promise.resolve(balancesStub));
      jest.spyOn(service, 'extractTreasuryValues').mockReturnValue(undefined);
      const record = await service.getBalanceSummary(networkStub[0]);
      expect(record[0]).toEqual(undefined);
    });

    it('Returns a treasury values object when passed in a valid balance', async () => {
      const { meta } =
        balancesStub['0x3bcf3db69897125aa61496fc8a8b55a5e3f245d5'];
      const expected = {
        total: meta[0].value,
        assets: meta[1].value,
        debt: meta[2].value,
      };
      const treasuryValues = service.extractTreasuryValues(balancesStub);
      expect(treasuryValues).toEqual(expected);
    });

    it('Returns a noting from treasury values if meta is empty', async () => {
      balancesStub['0x3bcf3db69897125aa61496fc8a8b55a5e3f245d5'].meta = [];
      const treasuryValues = service.extractTreasuryValues(balancesStub);
      expect(treasuryValues).toBeUndefined();
    });

    it('Fetches supported networks with the correct url', async () => {
      const spy = jest
        .spyOn(service.httpService, 'get')
        .mockImplementation(() => of(mockAxiosResponse));

      const { TREASURY_ADDRESS, ZAPPER_API_KEY } = process.env;
      const zapperApiUrl = 'https://api.zapper.fi/v1';
      const url = `${zapperApiUrl}/protocols/balances/supported?addresses%5B%5D=${TREASURY_ADDRESS}&api_key=${ZAPPER_API_KEY}`;
      await service.getSupportedNetworks();
      expect(spy).toHaveBeenCalledWith(url);
    });

    it('Returns balances with useful data', async () => {
      jest
        .spyOn(service, 'getBalanceSummary')
        .mockReturnValue(Promise.resolve(usefulDataStub));

      const records = await service.getNetworkBalance(networkStub[0]);
      expect(records.length).toEqual(usefulDataStub.length);
    });

    it("filters if balances returned don't have useful data", async () => {
      jest
        .spyOn(service, 'getBalanceSummary')
        .mockReturnValue(Promise.resolve(notUsefulDataStub));

      const records = await service.getNetworkBalance(networkStub[0]);
      expect(records.length).toEqual(0);
    });
  });

  describe('Testing loading to the DB', () => {
    it('Should initialise with no data', async () => {
      const data = await service.treasuryModel.find();
      expect(data.length).toEqual(0);
    });

    it('Should add a record', async () => {
      await service.loadDB(recordMockValue);
      const record = await service.treasuryModel.find();
      const firstRecord = record[0];
      const { underlying_assets } = firstRecord;
      expect(record.length).toEqual(1);
      expect(firstRecord.treasury).toEqual(assetMockValue.total);
      expect(underlying_assets[0].assets).toEqual(assetMockValue.assets);
      expect(underlying_assets[0].debt).toEqual(assetMockValue.debt);
      expect(underlying_assets[0].total).toEqual(assetMockValue.total);
      // @ts-expect-error (added by mongoose but not part of schema)
      expect(firstRecord.createdAt).toBeTruthy();
      // @ts-expect-error (added by mongoose but not part of schema)
      expect(firstRecord.updatedAt).toBeTruthy();
    });

    it('Should prevent adding a record with missing values', async () => {
      const { treasury } = recordMockValue;
      // @ts-expect-error (we are testing a runtime error)
      await expect(service.loadDB(treasury)).rejects.toThrowError();
    });

    it('should return a date object correctly', () => {
      const ago = service.daysAgo(7);
      const now = new Date();
      const sevenDaysInMSeconds = 7 * 24 * 60 * 60 * 1000;
      expect(now.getTime() - ago.getTime()).toBeGreaterThanOrEqual(
        sevenDaysInMSeconds,
      );
    });

    it('should return values from get treasury', async () => {
      await service.loadDB(recordMockValue);
      const res = await service.getTreasury();
      expect(res.length).toEqual(1);
    });

    it('should return no values from get treasury if days=0', async () => {
      await service.loadDB(recordMockValue);
      const res = await service.getTreasury(0);
      expect(res.length).toEqual(0);
    });

    it('Shoud load to the db correctly', async () => {
      jest
        .spyOn(service, 'getSupportedNetworks')
        .mockReturnValue(Promise.resolve(networkStub));
      jest
        .spyOn(service, 'getNetworkBalances')
        .mockReturnValue(Promise.resolve([usefulDataStub]));
      await service.loadTreasury();
      const record = await service.getTreasury(1);
      expect(Math.floor(record[0].treasury)).toEqual(TREASURY_TOTAL);
      expect(record[0].underlying_assets).toEqual(usefulDataStub);
    });
  });

  describe('Testing the utility functions', () => {
    it('Returns API calls as a promise with the data inside', async () => {
      jest
        .spyOn(service.httpService, 'get')
        .mockReturnValue(of(mockAxiosResponse));

      const res = await service.apiCall('');
      expect(res).toEqual(mockAxiosResponse.data);
    });

    it('Flattens arrays', () => {
      const x = [1, 2];
      const y = [3, 4, 5];
      expect(service.flatten([x, y])).toEqual([...x, ...y]);
    });
  });
});
