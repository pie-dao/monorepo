import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetTreasuryQuery {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  days: number;
}
