import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BusinessServiceProductsEntity } from '../products/entities/business.service.products.entity';
import { BusinessEntity } from './entities/business.entity';

@Injectable()
export class BusinessRepository extends Repository<BusinessEntity> {
  constructor(private dataSource: DataSource) {
    super(BusinessEntity, dataSource.createEntityManager());
  }

  async GetServiceProductsByBusinessId(id: number) {
    const query_runner = this.dataSource.createQueryRunner();
    const business_service_products = await query_runner.manager
      .getRepository(BusinessServiceProductsEntity)
      .createQueryBuilder('bsp')
      .select([
        'bsp.id',
        's.name as service_name',
        `array_agg(p.name) as product_name`,
        `array_agg(price) as price`,
      ])
      .leftJoin('services', 's', 's.id = bsp.service_id')
      .leftJoin('products', 'p', 'p.id = bsp.product_id')
      .where(`bsp.business_id='${id}'`)
      .groupBy(`s.name, bsp.id`)
      .getRawMany();
    return business_service_products;
  }
}
