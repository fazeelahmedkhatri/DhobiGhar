import { UserEntity } from '../../../modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { OrdersEntity } from '../../../modules/orders/entities/orders.entity';

@Entity('business')
export class BusinessEntity extends DefaultEntity {
  @Column({
    name: 'address',
    nullable: true,
  })
  address: string;

  @Column({
    name: 'is_approved',
    type: 'boolean',
    default: false,
  })
  is_approved: boolean;

  @Column({
    name: 'business_name',
    nullable: true,
  })
  business_name: string;

  @Column({
    name: 'business_description',
    nullable: true,
  })
  business_description: string;

  @Column({
    name: 'business_contact',
    length: 255,
    nullable: false,
    unique: true,
  })
  business_contact: string;

  @Column({
    name: 'urgent_delivery',
    type: 'boolean',
    default: false,
  })
  urgent_delivery: boolean;

  @Column({
    name: 'urgent_charges_percentage',
    nullable: true,
  })
  urgent_charges_percentage: number;

  @Column()
  user_id: number;

  @OneToOne(() => UserEntity, (users) => users.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  users: UserEntity;

  @OneToMany(() => OrdersEntity, (o) => o.business, { cascade: true })
  business: BusinessEntity[];
}
