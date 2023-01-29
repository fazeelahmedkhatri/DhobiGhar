import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CartEntity } from './entities/cart.entity';
import { OrdersEntity } from './entities/orders.entity';

@Injectable()
export class OrdersRepository extends Repository<OrdersEntity> {
  constructor(private dataSource: DataSource) {
    super(OrdersEntity, dataSource.createEntityManager());
  }
  async GetCartByConsumerId(id: number) {
    const query_runner = this.dataSource.createQueryRunner();
    const business_service_products = await query_runner.manager
      .getRepository(CartEntity)
      .createQueryBuilder('c')
      .select([
        'p.name as product_name',
        's.name as service_name',
        `bsp.price as price`,
        `c.total_amount as total_amount`,
        `quantity`,
      ])
      .leftJoin('cart_business_service_products', 'cbsp', 'c.id = cbsp.cart_id')
      .leftJoin(
        'business_service_products',
        'bsp',
        'bsp.id = cbsp.business_service_product_id',
      )
      .leftJoin('products', 'p', 'p.id = bsp.product_id')
      .leftJoin('services', 's', 's.id = bsp.service_id')

      .where(`c.consumer_id='${id}'`)
      .getRawMany();
    return business_service_products;
  }
}
