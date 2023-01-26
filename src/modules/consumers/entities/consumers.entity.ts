import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

@Entity('consumers')
export class ConsumersEntity extends DefaultEntity {
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
}
