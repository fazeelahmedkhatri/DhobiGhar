import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRidersDto {
  @ApiProperty({ example: 'ABC Street DEF Road' })
  @IsString()
  address: string | null;

  @ApiProperty({ example: '1111111111111' })
  @IsString()
  cnic_number: string | null;

  @ApiProperty({ example: 'KMM-120' })
  @IsString()
  bike_number: string | null;

  @ApiProperty({ example: 'ibb.com/esklpt' })
  @IsString()
  profile_image_url: string | null;
}
