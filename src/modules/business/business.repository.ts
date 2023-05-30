import { ServicesEntity } from './../services/entities/services.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BusinessServiceProductsEntity } from '../products/entities/business.service.products.entity';
import { BusinessEntity } from './entities/business.entity';
import { OrdersEntity } from '../orders/entities/orders.entity';

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
  async GetPastOrdersByBusiness(id: number) {
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
      .where(`o.business='${id}' AND o.order_status='delivered_to_consumer'`)
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

  async GetBusinessById(id: number) {
    const query_runner = this.dataSource.createQueryRunner();
    const businesses = await query_runner.manager
      .getRepository(BusinessServiceProductsEntity)
      .createQueryBuilder('bsp')
      .select([
        `DISTINCT b.business_name as business_name`,
        `b.urgent_charges_percentage as urgent_charges_percentage`,
        `b.business_description as business_description`,
        `b.urgent_delivery as urgent_delivery`,
        'array_agg(DISTINCT s.id) as service_id',
        'array_agg(DISTINCT s.name) as service_name',
      ])
      .leftJoin('business', 'b', 'bsp.business_id = b.id')
      .leftJoin('services', 's', 's.id = bsp.service_id')
      .where(`bsp.business_id='${id}'`)
      .groupBy(
        `business_name,
     urgent_charges_percentage,
     business_description,
     urgent_delivery`,
      )
      .getRawMany();

    const result = businesses.map((business) => {
      return {
        id: business.id,
        business_name: business.business_name,
        urgent_charges_percentage: business.urgent_charges_percentage,
        business_description: business.business_description,
        urgent_delivery: business.urgent_delivery,
        services: business.service_id.map((id, index) => ({
          id,
          name: business.service_name[index],
        })),
      };
    });
    return result[0];
  }

  async GetBusinessProductsByService(business_id: number, service_id: number) {
    const query_runner = this.dataSource.createQueryRunner();
    const products = await query_runner.manager
      .getRepository(BusinessServiceProductsEntity)
      .createQueryBuilder('bsp')
      .select([
        'array_agg(DISTINCT bsp.id) as business_service_product_id',
        'array_agg(DISTINCT p.id) as product_id',
        'array_agg(DISTINCT p.name) as product_name',
        'array_agg(bsp.price) as price',
      ])
      .leftJoin('products', 'p', 'p.id = bsp.product_id')
      .where(`bsp.service_id=${service_id} AND bsp.business_id=${business_id}`)
      .groupBy()
      .getRawMany();

    const result = products.map((product) => {
      return {
        products: product.product_id.map((id, index) => ({
          id,
          name: product.product_name[index],
          price: product.price[index],
          business_service_product_id:
            product.business_service_product_id[index],
        })),
      };
    });
    return result[0];
  }
}
