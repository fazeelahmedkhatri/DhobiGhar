import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { ConsumersService } from './consumers.service';
import { ConsumersEntity } from './entities/consumers.entity';
import { CreateConsumersDto } from './dto/create-consumers.dto';
import { ConsumersResponseDto } from './dto/consumers-response.dto';
import { UpdateConsumersDto } from './dto/update-consumers.dto';
import { plainToInstance } from 'class-transformer';
import { IRedisUserModel, iResponseJson } from '../base/base.interface';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@ApiTags('Consumers')
@Controller({
  path: 'consumers',
  version: '1',
})
export class ConsumersController extends ControllerFactory(
  ConsumersEntity,
  CreateConsumersDto,
  UpdateConsumersDto,
  ConsumersResponseDto,
) {
  constructor(private consumersService: ConsumersService) {
    super(consumersService);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async Create(
    @Body() body: CreateConsumersDto,
    @Req() req: Request,
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const response = await this.consumersService.CreateConsumers(
        { ...body },
        current_user,
      );
      const mapped_response = plainToInstance(ConsumersResponseDto, response);
      const resp = this.CreatedResponse(mapped_response);
      return resp;
    } catch (error) {
      throw error;
    }
  }
  @HttpCode(HttpStatus.OK)
  @Get('/order/get')
  async GetConsumerOrders(
    @CurrentUser() current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const consumer_orders = await this.consumersService.GetConsumerOrders(
        current_user.user_id,
      );
      const resp = this.OKResponse(consumer_orders);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
