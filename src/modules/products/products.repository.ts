import { Injectable } from '@nestjs/common';;
import { DataSource, Repository } from 'typeorm';
import { ProductsEntity } from  './entities/products.entity'

@Injectable()
export class ProductsRepository extends Repository<ProductsEntity> {
	constructor(private dataSource: DataSource) {
		super(ProductsEntity, dataSource.createEntityManager());
	}
}