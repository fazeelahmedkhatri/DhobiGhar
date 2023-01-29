import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRidersDto {
  @ApiProperty({ example: 'ABC Street DEF Road' })
  @IsNotEmpty()
  @IsString()
  address: string | null;

  @ApiProperty({ example: '1111111111111' })
  @IsNotEmpty()
  @IsString()
  cnic_number: string | null;

  @ApiProperty({ example: 'KMM-120' })
  @IsString()
  bike_number: string | null;

  @ApiProperty({ example: 'ibb.com/esklpt' })
  @IsString()
  profile_image_url: string | null;
}
