import { Cart_Status_Enum } from '../../../common/enum';
import { ConsumersEntity } from '../../../modules/consumers/entities/consumers.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

@Entity('cart')
export class CartEntity extends DefaultEntity {
  @Column({
    name: 'total_amount',
  })
  total_amount: number;

  @Column({
    name: 'cart_status',
    type: 'enum',
    enum: Cart_Status_Enum,
    default: Cart_Status_Enum.OPEN,
  })
  cart_status: Cart_Status_Enum;

  @Column()
  consumer_id: number;

  @OneToOne(() => ConsumersEntity, (consumers) => consumers.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'consumer_id', referencedColumnName: 'id' })
  consumers: ConsumersEntity;
}
