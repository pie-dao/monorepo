import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';

export class CgCoinDTO {
  @ApiProperty()
  @IsArray()
  timestamp: string;

  @ApiProperty()
  @IsObject()
  coin: object;
}
