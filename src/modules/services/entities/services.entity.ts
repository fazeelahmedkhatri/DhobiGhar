import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

@Entity('services')
export class ServicesEntity extends DefaultEntity {
  @Column()
  name: string;
}
