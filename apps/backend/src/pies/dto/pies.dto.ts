import { ApiProperty } from "@nestjs/swagger";
import { IsHexadecimal, IsArray } from "class-validator";

export class PieDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsHexadecimal()
  address: string;

  @ApiProperty()
  @IsArray()
  history: Array<string>;  
}