import { Injectable } from '@nestjs/common';;
import { BaseService } from '../base/base.service';
import { OrdersEntity } from  './entities/orders.entity'
import { OrdersRepository } from'./orders.repository';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { OrdersResponseDto } from './dto/orders-response.dto';
import { UpdateOrdersDto } from './dto/update-orders.dto';

@Injectable()
export class OrdersService extends BaseService<
	OrdersEntity,
	CreateOrdersDto,
	UpdateOrdersDto,
	OrdersResponseDto
> {
	constructor(private ordersRepository: OrdersRepository ) {
		super(ordersRepository);
	}
}