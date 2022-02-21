import { ApiProperty } from "@nestjs/swagger";
import { IsHexadecimal, IsObject, IsArray } from "class-validator";

export class PieDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;  

  @ApiProperty()
  @IsHexadecimal()
  address: string;

  @ApiProperty()
  @IsArray()
  history: Array<string>;  

  @ApiProperty()
  @IsHexadecimal()
  coingecko_id: string;   
}