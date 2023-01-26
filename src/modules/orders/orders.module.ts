import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from'./orders.controller';
import { OrdersService } from'./orders.service';
import { OrdersRepository } from'./orders.repository';
import { OrdersEntity } from './entities/orders.entity'

@Module({
	imports: [TypeOrmModule.forFeature([OrdersEntity])],
	providers: [OrdersService, OrdersRepository],
	controllers: [OrdersController],
	exports: [OrdersService]
})

export class OrdersModule {}