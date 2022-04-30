import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PieHistoryEntity,
  PieHistorySchema,
} from 'src/pies/entities/pie-history.entity';
import { PieEntity, PieSchema } from 'src/pies/entities/pie.entity';
import { BotServiceImpl } from './bot.service';

describe('BotService', () => {
  let target: BotServiceImpl;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [],
      providers: [BotServiceImpl],
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

    target = app.get<BotServiceImpl>(BotServiceImpl);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Given a Bot Service', () => {
    it('When updating the NAVs Then it should update the Discord servers', async () => {
      await target.initialize();
      await target.updateNAVChannels();
    });
  });
});
