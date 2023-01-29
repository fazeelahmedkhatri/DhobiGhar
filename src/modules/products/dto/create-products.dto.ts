import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductsDto {
  @ApiProperty({ example: 'T-Shirt' })
  @IsNotEmpty()
  @IsString()
  name: string | null;
}
