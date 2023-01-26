import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { RoleEntity } from '../../roles/entities/role.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { CreateUserDto } from './create-user.dto';
import { MESSAGES } from 'src/common/messages';

const {
  EMAIL: {
    ERROR: { INVALID_EMAIL, EMAIL_DOES_NOT_EXIST },
  },
  ROLE: {
    ERROR: { ROLE_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class UpdateUserDto extends OmitType(CreateUserDto, ['email'] as const) {
  @ApiProperty({ example: 'info@inaequo.net' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsExist, ['users'], {
    message: EMAIL_DOES_NOT_EXIST,
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

  @ApiProperty({ example: 'Inaequo Solutions' })
  @IsNotEmpty()
  @IsBoolean()
  verified: boolean | null;

  @ApiProperty({ example: 'Inaequo Solutions' })
  @IsNotEmpty()
  @IsBoolean()
  approved: boolean | null;
}
