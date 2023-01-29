import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { MESSAGES } from 'src/common/messages';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';

const {
  PRODUCTS: {
    ERROR: { PRODUCT_DOES_NOT_EXIST },
  },
  SERVICES: {
    ERROR: { SERVICE_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class AddProductAndServicesDto {
  @ApiProperty({ example: [1, 2] })
  @Validate(IsMultipleExist, ['products', 'id'], {
    message: PRODUCT_DOES_NOT_EXIST,
  })
  @IsNotEmpty()
  @IsArray()
  products: number[];

  @ApiProperty({ example: [100, 200] })
  @IsNotEmpty()
  @IsArray()
  price: number[];

  @ApiProperty({ example: 1 })
  @Validate(IsExist, ['services', 'id'], {
    message: SERVICE_DOES_NOT_EXIST,
  })
  @IsNotEmpty()
  @IsNumber()
  service_id: number;
}
