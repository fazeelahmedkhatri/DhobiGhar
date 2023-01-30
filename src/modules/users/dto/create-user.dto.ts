import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../../../utils/validators/is-not-exists.validator';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { MESSAGES } from 'src/common/messages';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Gender_Enum } from 'src/common/enum';

const {
  EMAIL: {
    ERROR: { INVALID_EMAIL, EMAIL_IS_EXIST },
  },
  PASSWORD: {
    ERROR: { PASSWORD_RULES },
  },
  ROLE: {
    ERROR: { ROLE_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class CreateUserDto {
  @ApiProperty({ example: 'info@inaequo.net' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['users'], {
    message: EMAIL_IS_EXIST,
  })
  @IsEmail()
  @IsString()
  @Matches(
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
    {
      message: INVALID_EMAIL,
    },
  )
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  @IsString()
  @Matches(/^(?=.*\d).{6,16}$/i, {
    message: PASSWORD_RULES,
  })
  password?: string;

  @ApiProperty({ example: '+923333333333' })
  @IsNotEmpty()
  @IsString()
  contact_number: string | null;

  @ApiProperty({ type: RoleEntity })
  @IsString()
  role: string | null;

  @ApiProperty({ example: 'Karachi' })
  @IsString()
  city: string | null;

  @ApiProperty({ example: 'John' })
  @IsString()
  full_name: string | null;

  @ApiProperty()
  @IsString()
  birth_date: Date | null;

  @ApiProperty({ enum: Gender_Enum })
  @IsEnum(Gender_Enum, { message: ROLE_DOES_NOT_EXIST })
  gender: Gender_Enum | null;
}
