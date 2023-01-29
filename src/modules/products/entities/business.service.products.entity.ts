import { BusinessEntity } from '../../business/entities/business.entity';
import { ServicesEntity } from '../../services/entities/services.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { ProductsEntity } from './products.entity';

@Entity('business_service_products')
export class BusinessServiceProductsEntity extends DefaultEntity {
  @Column()
  price: number;

  @Column()
  business_id: number;

  @ManyToOne(() => BusinessEntity, (business) => business.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'business_id', referencedColumnName: 'id' })
  business: BusinessEntity;

  @Column()
  service_id: number;

  @ManyToOne(() => ServicesEntity, (services) => services.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'service_id', referencedColumnName: 'id' })
  services: ServicesEntity;

  @Column()
  product_id: number;

  @ManyToOne(() => ProductsEntity, (products) => products.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  products: ProductsEntity;
}
