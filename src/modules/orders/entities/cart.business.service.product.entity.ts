import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { CartEntity } from './cart.entity';
import { BusinessServiceProductsEntity } from '../../products/entities/business.service.products.entity';

@Entity('cart_business_service_products')
export class CartBusinessServiceProductsEntity extends DefaultEntity {
  @Column({
    name: 'quantity',
    default: 1,
  })
  quantity: number;

  @Column()
  cart_id: number;

  @ManyToOne(() => CartEntity, (cart) => cart.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  carts: CartEntity;

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
