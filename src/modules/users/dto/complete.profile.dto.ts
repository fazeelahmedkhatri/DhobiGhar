import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Gender_Enum } from 'src/common/enum';
import { MESSAGES } from 'src/common/messages';
const {
  USER: {
    ERROR: {
      GENDER_DOES_NOT_EXIST,
      BLOOD_GROUP_DOES_NOT_EXIST,
      MARITAL_STATUS_DOES_NOT_EXIST,
    },
  },
} = MESSAGES;

export class CompleteProfileDto {
  @ApiProperty({ example: 'Karachi' })
  @IsString()
  city: string | null;

  @ApiProperty({ example: 'John' })
  @IsString()
  full_name: string | null;

  @ApiProperty({ example: '5.0' })
  @IsString()
  rating: string | null;

  @ApiProperty()
  @IsString()
  birth_date: Date | null;

  @ApiProperty({ enum: Gender_Enum })
  @IsEnum(Gender_Enum, { message: GENDER_DOES_NOT_EXIST })
  gender: Gender_Enum | null;
}
