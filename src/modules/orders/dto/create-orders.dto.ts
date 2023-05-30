import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Order_Status_Enum } from 'src/common/enum';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Type } from 'class-transformer';

class BusinessServiceProductsDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  unit: number;
}

export class CreateOrdersDto {
  @ApiProperty({ example: 2000 })
  @IsNotEmpty()
  @IsNumber()
  total_amount: number;

  @ApiProperty({ example: [{ id: 1, unit: 20 }] })
  @IsNotEmpty()
  @IsArray()
  @Type(() => BusinessServiceProductsDto)
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  business_service_products: BusinessServiceProductsDto[];

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

  @ApiProperty({ example: 'black t shirt is new' })
  @IsNotEmpty()
  @IsString()
  order_description: string | null;

  @ApiProperty({ enum: Order_Status_Enum })
  @IsEnum(Order_Status_Enum, { message: 'Order status does not exist' })
  order_status: Order_Status_Enum | null;

  @ApiProperty({ example: 1 })
  @Validate(IsExist, ['consumers', 'id'], {
    message: 'Consumer not found',
  })
  @IsNotEmpty()
  @IsNumber()
  consumer_id: number;

  @ApiProperty({ example: 1 })
  @Validate(IsExist, ['business', 'id'], {
    message: 'Business not found',
  })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  is_payment_completed: boolean | null;
}
