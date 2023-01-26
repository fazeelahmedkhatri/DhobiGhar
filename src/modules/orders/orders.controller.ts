import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { OrdersService } from './orders.service';
import { OrdersEntity } from  './entities/orders.entity'
import { CreateOrdersDto } from './dto/create-orders.dto';
import { OrdersResponseDto } from './dto/orders-response.dto';
import { UpdateOrdersDto } from './dto/update-orders.dto';

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
	constructor(private ordersService: OrdersService ) {
		super(ordersService);
	}
}