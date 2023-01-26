import { Injectable } from '@nestjs/common';;
import { BaseService } from '../base/base.service';
import { ProductsEntity } from  './entities/products.entity'
import { ProductsRepository } from'./products.repository';
import { CreateProductsDto } from './dto/create-products.dto';
import { ProductsResponseDto } from './dto/products-response.dto';
import { UpdateProductsDto } from './dto/update-products.dto';

@Injectable()
export class ProductsService extends BaseService<
	ProductsEntity,
	CreateProductsDto,
	UpdateProductsDto,
	ProductsResponseDto
> {
	constructor(private productsRepository: ProductsRepository ) {
		super(productsRepository);
	}
}