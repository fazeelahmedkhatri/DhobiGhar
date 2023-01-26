import { Injectable } from '@nestjs/common';;
import { DataSource, Repository } from 'typeorm';
import { OrdersEntity } from  './entities/orders.entity'

@Injectable()
export class OrdersRepository extends Repository<OrdersEntity> {
	constructor(private dataSource: DataSource) {
		super(OrdersEntity, dataSource.createEntityManager());
	}
}