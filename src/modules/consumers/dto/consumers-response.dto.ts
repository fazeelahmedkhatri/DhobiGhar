import { Exclude, Expose } from 'class-transformer';
import { Column } from 'typeorm';

@Exclude()
export class ConsumersResponseDto {
  @Expose()
  @Column({
    name: 'id',
  })
  id: number;

  @Expose()
  @Column({
    name: 'address',
    type: 'varchar',
  })
  address: string;

  @Expose()
  @Column({
    name: 'longitude',
    type: 'varchar',
  })
  longitude: string;

  @Expose()
  @Column({
    name: 'latitude',
    type: 'varchar',
  })
  latitude: string;
}
