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
import { OrdersService } from './orders.service';
import { OrdersEntity } from './entities/orders.entity';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { OrdersResponseDto } from './dto/orders-response.dto';
import { UpdateOrdersDto } from './dto/update-orders.dto';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IRedisUserModel, iResponseJson } from '../base/base.interface';
import { BusinessResponseDto } from '../business/dto/business-response.dto';
import { CreateBusinessDto } from '../business/dto/create-business.dto';
import { Request } from 'express';
import { CreateCartDto } from './dto/create-cart.dto';

@ApiTags('Orders')
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController extends ControllerFactory(
  OrdersEntity,
  CreateOrdersDto,
  UpdateOrdersDto,
  OrdersResponseDto,
) {
  constructor(private ordersService: OrdersService) {
    super(ordersService);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('cart/create')
  async CreateCart(
    @Body() body: CreateCartDto,
    @Req() _req: Request,
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const response = await this.ordersService.CreateCart(
        { ...body },
        current_user,
      );
      const mapped_response = plainToInstance(BusinessResponseDto, response);
      const resp = this.CreatedResponse(mapped_response);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('cart/get')
  async GetCartByUser(
    @CurrentUser() current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const cart_details = await this.ordersService.GetCartByUser(
        current_user.user_id,
      );
      const resp = this.OKResponse(cart_details);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
