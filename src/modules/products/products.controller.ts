import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { ProductsService } from './products.service';
import { ProductsEntity } from  './entities/products.entity'
import { CreateProductsDto } from './dto/create-products.dto';
import { ProductsResponseDto } from './dto/products-response.dto';
import { UpdateProductsDto } from './dto/update-products.dto';

@ApiTags('Products')
@Controller({
	path: 'products',
	version: '1',
})
export class ProductsController extends ControllerFactory(
	ProductsEntity,
	CreateProductsDto,
	UpdateProductsDto,
	ProductsResponseDto,
) {
	constructor(private productsService: ProductsService ) {
		super(productsService);
	}
}