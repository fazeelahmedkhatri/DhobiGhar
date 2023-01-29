import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServicesDto {
  @ApiProperty({ example: 'Washing' })
  @IsNotEmpty()
  @IsString()
  name: string | null;
}
