import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { IRedisUserModel, iResponseJson } from '../base/base.interface';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CompleteProfileDto } from './dto/complete.profile.dto';
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController extends ControllerFactory<
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
  UserResponse
>(UserEntity, CreateUserDto, UpdateUserDto, UserResponse) {
  constructor(protected userService: UserService) {
    super(userService);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  // @UsePipes(createPipe)
  async Create(
    @Body() body: CreateUserDto,
    @Req() req: Request,
  ): Promise<iResponseJson> {
    try {
      const response = await this.userService.Create({ ...body }, req);
      const mapped_resp = plainToInstance(UserResponse, response);
      const resp = this.CreatedResponse(mapped_resp);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put('/complete/profile')
  async CompleteProfile(
    @Body() data: CompleteProfileDto,
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const user_details = await this.userService.CompleteProfileStepOne(
        data,
        current_user,
      );
      const mapped_user = plainToInstance(CompleteProfileDto, user_details);
      const resp = this.OKResponse(mapped_user);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
