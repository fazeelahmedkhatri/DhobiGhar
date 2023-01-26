import { BusinessServiceProductsEntity } from '../../products/entities/business.service.products.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { OrdersEntity } from './orders.entity';

@Entity('orders_business_services_products')
export class OrdersBusinessServicesProductsEntity extends DefaultEntity {
  @Column({
    name: 'unit',
    nullable: true,
  })
  unit: number;

  @Column()
  order_id: number;

  @ManyToOne(() => OrdersEntity, (orders) => orders.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  orders: OrdersEntity;

  @Column()
  business_service_product_id: number;

  @ManyToOne(() => BusinessServiceProductsEntity, (bsp) => bsp.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
    name: 'business_service_product_id',
    referencedColumnName: 'id',
  })
  business_service_products: BusinessServiceProductsEntity;
}
