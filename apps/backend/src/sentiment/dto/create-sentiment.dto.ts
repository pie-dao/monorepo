import { ApiProperty } from '@nestjs/swagger';

export class CreateSentimentDto {
  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  vote: 'positive' | 'negative';
}
