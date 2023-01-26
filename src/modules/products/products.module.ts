import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from'./products.controller';
import { ProductsService } from'./products.service';
import { ProductsRepository } from'./products.repository';
import { ProductsEntity } from './entities/products.entity'

@Module({
	imports: [TypeOrmModule.forFeature([ProductsEntity])],
	providers: [ProductsService, ProductsRepository],
	controllers: [ProductsController],
	exports: [ProductsService]
})

export class ProductsModule {}