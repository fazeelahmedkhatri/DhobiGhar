import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ConsumersEntity } from './entities/consumers.entity';
import { OrdersEntity } from '../orders/entities/orders.entity';

@Injectable()
export class ConsumersRepository extends Repository<ConsumersEntity> {
  constructor(private dataSource: DataSource) {
    super(ConsumersEntity, dataSource.createEntityManager());
  }

  async GetOrderByConsumerId(id: number) {
    const query_runner = this.dataSource.createQueryRunner();
    const orders = await query_runner.manager
      .getRepository(OrdersEntity)
      .createQueryBuilder('o')
      .select([
        `o.id as id`,
        `bsp.price as price`,
        `ps.total_amount as total_amount`,
        `o.order_status as order_status`,
        `o.order_description as order_description`,
        `o.address as address`,
        `o.longitude as longitude`,
        `o.latitude as latitude`,
        `obsp.unit as unit`,
        `ps.is_payment_completed`,
        `array_agg(p.name) as product_name`,
        `array_agg(s.name) as service_name`,
      ])
      .leftJoin(
        'orders_business_services_products',
        'obsp',
        'o.id = obsp.order_id',
      )
      .leftJoin(
        'business_service_products',
        'bsp',
        'bsp.id = obsp.business_service_product_id',
      )
      .leftJoin('products', 'p', 'p.id = bsp.product_id')
      .leftJoin('services', 's', 's.id = bsp.service_id')
      .leftJoin('payments', 'ps', 'ps.id = o.payment_id')
      .where(`o.consumer_id='${id}'`)
      .groupBy(
        `o.id, ps.is_payment_completed,   bsp.price ,
        ps.total_amount ,
        o.order_status ,
        o.order_description,
        o.address,
        o.longitude,
        o.latitude,
        obsp.unit`,
      )
      .getRawMany();

    const transformedOrders = [];
    const orderIds = new Set();

    orders.forEach((order) => {
      const orderId = order.id;
      let transformedOrder = transformedOrders.find((o) => o.id === orderId);

      if (!transformedOrder) {
        transformedOrder = {
          ps_is_payment_completed: order.ps_is_payment_completed,
          id: order.id,
          price: order.price,
          total_amount: order.total_amount,
          order_status: order.order_status,
          order_description: order.order_description,
          address: order.address,
          longitude: order.longitude,
          latitude: order.latitude,
          products: [],
          services: [],
        };
        transformedOrders.push(transformedOrder);
      }

      const product = order.product_name[0];
      const service = order.service_name[0];

      if (product && !transformedOrder.products.includes(product)) {
        transformedOrder.products.push(product);
      }

      if (service && !transformedOrder.services.includes(service)) {
        transformedOrder.services.push(service);
      }
    });

    return transformedOrders;
  }
}
