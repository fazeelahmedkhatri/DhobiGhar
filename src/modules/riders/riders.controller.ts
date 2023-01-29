import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { RidersService } from './riders.service';
import { RidersEntity } from './entities/riders.entity';
import { CreateRidersDto } from './dto/create-riders.dto';
import { RidersResponseDto } from './dto/riders-response.dto';
import { UpdateRidersDto } from './dto/update-riders.dto';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IRedisUserModel, iResponseJson } from '../base/base.interface';
import { Request } from 'express';

@ApiTags('Riders')
@Controller({
  path: 'riders',
  version: '1',
})
export class RidersController extends ControllerFactory(
  RidersEntity,
  CreateRidersDto,
  UpdateRidersDto,
  RidersResponseDto,
) {
  constructor(private ridersService: RidersService) {
    super(ridersService);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async Create(
    @Body() body: CreateRidersDto,
    @Req() req: Request,
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const response = await this.ridersService.CreateRiders(
        { ...body },
        current_user,
      );
      const mapped_response = plainToInstance(RidersResponseDto, response);
      const resp = this.CreatedResponse(mapped_response);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
