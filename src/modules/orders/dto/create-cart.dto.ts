import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, Validate } from 'class-validator';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';

export class CreateCartDto {
  @ApiProperty({ example: [2, 3, 4] })
  @IsNotEmpty()
  @IsArray()
  quantity: number[];

  @ApiProperty({ example: [1, 2] })
  @Validate(IsMultipleExist, ['business_service_products', 'id'], {
    message: 'Such type of product against the chosen service does not exist',
  })
  @IsNotEmpty()
  @IsArray()
  business_service_products: number[];
}
