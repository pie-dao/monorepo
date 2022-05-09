import { Test, TestingModule } from '@nestjs/testing';
import { PieDto } from '../dto/pies.dto';

describe('PieDto', () => {
  let pieDTO: PieDto;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [PieDto],
    }).compile();

    pieDTO = app.get<PieDto>(PieDto);
  });

  it('should be defined', () => {
    expect(pieDTO).toBeDefined();
  });
});
