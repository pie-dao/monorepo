import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class CgChartDTO {
  @ApiProperty()
  @IsArray()
  prices: Array<Array<Number>>;

  @ApiProperty()
  @IsArray()
  market_caps: Array<Array<Number>>;


  @ApiProperty()
  @IsArray()
  total_volumes: Array<Array<Number>>;
}