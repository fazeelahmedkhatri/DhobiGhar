import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConsumersDto {
  @ApiProperty({ example: 'ABC Street DEF Road' })
  @IsNotEmpty()
  @IsString()
  address: string | null;

  @ApiProperty({ example: '100092.1029' })
  @IsNotEmpty()
  @IsString()
  longitude: string | null;

  @ApiProperty({ example: '9800092.1029' })
  @IsNotEmpty()
  @IsString()
  latitude: string | null;
}
