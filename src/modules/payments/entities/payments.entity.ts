import { Entity } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

@Entity('payments')
export class PaymentsEntity extends DefaultEntity {}
