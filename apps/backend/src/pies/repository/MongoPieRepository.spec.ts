import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import BigNumber from 'bignumber.js';
import { v4 as uuid } from 'uuid';
import {
  PieHistoryEntity,
  PieHistorySchema,
} from '../entities/pie-history.entity';
import { PieEntity, PieSchema } from '../entities/pie.entity';
import { MongoPieRepository } from './MongoPieRepository';

describe('Given a PieRepository', () => {
  let target: MongoPieRepository;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [],
      providers: [MongoPieRepository],
      imports: [
        MongooseModule.forRoot(process.env.MONGO_DB_TEST),
        MongooseModule.forFeature([
          { name: PieEntity.name, schema: PieSchema },
        ]),
        MongooseModule.forFeature([
          { name: PieHistoryEntity.name, schema: PieHistorySchema },
        ]),
      ],
    }).compile();

    target = app.get<MongoPieRepository>(MongoPieRepository);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('When trying to create a new Pie without history', () => {
    it('Then it is successfully created', async () => {
      const name = uuid();

      const pie = {
        name: name,
        address: '0x273B845B24680B21394E5A07840d981Fd50601E5',
        coingeckoId: '0',
        history: [],
        symbol: 'TST',
      };

      await target.create(pie);

      const result = await target.findOneByName(name);

      expect(result).toEqual(pie);
    });
  });

  describe('When trying to create a new Pie with history', () => {
    it('Then it is successfully created', async () => {
      const name = uuid();

      const pie = {
        name: name,
        address: '0x0',
        coingeckoId: '0',
        history: [
          {
            timestamp: '1648158300006',
            nav: 0.9989370855600695,
            decimals: 18,
            marginalTVL: new BigNumber('42776.27367578742775509122'),
            totalSupply: new BigNumber('0x09115fb5923bc049e09e'),
            underlyingAssets: [
              {
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                symbol: 'USDC',
                decimals: 6,
                amount: '20151719756',
                usdPrice: '0.998853',
                marginalTVL: new BigNumber('20128.605733439868'),
                marginalTVLPercentage: 47.055538044,
              },
            ],
          },
        ],
        symbol: 'TST',
      };

      await target.create(pie);

      const result = await target.findOneByName(name);

      expect(jsonify(result)).toEqual(jsonify(pie));
    });
  });
});

const jsonify = <T>(obj: T) => JSON.parse(JSON.stringify(obj));
