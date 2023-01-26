import { ApiProperty } from '@nestjs/swagger';
import { IsArray, Validate } from 'class-validator';
import { RoleEntity } from '../../roles/entities/role.entity';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';
import { RouteEntity } from '../entities/route.entity';
import { MESSAGES } from 'src/common/messages';

const {
  ROLE: {
    ERROR: { ROLE_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class ModifyRouteDto {
  @ApiProperty({ type: RoleEntity })
  @IsArray()
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  new_roles: RouteEntity[] | null;

  @ApiProperty({ type: RoleEntity })
  @IsArray()
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  delete_roles: RouteEntity[] | null;
}
