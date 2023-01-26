import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

@Entity('products')
export class ProductsEntity extends DefaultEntity {
  @Column()
  name: string;
}
