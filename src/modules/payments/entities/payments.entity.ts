import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

@Entity('payments')
export class PaymentsEntity extends DefaultEntity {
  @Column({
    name: 'total_amount',
  })
  total_amount: number;

  @Column({
    name: 'is_payment_completed',
    type: 'boolean',
  })
  is_payment_completed: boolean;
}
