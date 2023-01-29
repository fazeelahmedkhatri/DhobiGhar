import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBusinessDto {
  @ApiProperty({ example: 'ABC Laundry' })
  @IsString()
  name: string | null;

  @ApiProperty({ example: '+923333333333' })
  @IsString()
  business_contact: string | null;

  @ApiProperty()
  @IsBoolean()
  urgent_delivery: boolean | null;

  @ApiProperty({ example: '10' })
  @IsNumber()
  urgent_charges_percentage: string | null;
}
