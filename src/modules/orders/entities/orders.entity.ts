import { Order_Status_Enum } from '../../../common/enum';
import { ConsumersEntity } from '../../../modules/consumers/entities/consumers.entity';
import { PaymentsEntity } from '../../../modules/payments/entities/payments.entity';
import { RidersEntity } from '../../../modules/riders/entities/riders.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

@Entity('orders')
export class OrdersEntity extends DefaultEntity {
  @Column({
    name: 'address',
    nullable: true,
  })
  address: string;

  @Column({
    name: 'longitude',
    nullable: true,
  })
  longitude: string;

  @Column({
    name: 'latitude',
    nullable: true,
  })
  latitude: string;

  @Column({
    name: 'order_description',
    nullable: true,
  })
  order_description: string;

  @Column({
    name: 'order_status',
    type: 'enum',
    enum: Order_Status_Enum,
    default: Order_Status_Enum.PENDING,
  })
  order_status: Order_Status_Enum;

  @Column()
  rider_id: number;

  @ManyToOne(() => RidersEntity, (riders) => riders.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'rider_id', referencedColumnName: 'id' })
  riders: RidersEntity;

  @Column()
  consumer_id: number;

  @ManyToOne(() => ConsumersEntity, (consumers) => consumers.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'consumer_id', referencedColumnName: 'id' })
  consumers: ConsumersEntity;

  @Column()
  payment_id: number;

  @ManyToOne(() => PaymentsEntity, (payments) => payments.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'payment_id', referencedColumnName: 'id' })
  payments: PaymentsEntity;
}
