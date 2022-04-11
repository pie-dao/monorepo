import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTreasuryQuery } from '../dto/getTreasury.dto';

describe('GetTreasuryQuery', () => {
  let getTreasuryDTO: GetTreasuryQuery;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [GetTreasuryQuery],
    }).compile();

    getTreasuryDTO = app.get<GetTreasuryQuery>(GetTreasuryQuery);
  });

  it('should be defined', () => {
    expect(getTreasuryDTO).toBeDefined();
  });
});

describe('DTO validation', () => {
  let target: ValidationPipe;
  const metadata: ArgumentMetadata = {
    type: 'query',
    metatype: GetTreasuryQuery,
    data: '',
  };

  beforeEach(() => {
    target = new ValidationPipe({ transform: true });
  });

  it('Transforms strings to integers', async () => {
    const testparam = { days: '1' };
    const output = await target.transform(testparam, metadata);
    expect(output).toBeInstanceOf(GetTreasuryQuery);
    expect(output.days).toEqual(1);
  });
});
