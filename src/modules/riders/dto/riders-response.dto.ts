import { Exclude, Expose } from 'class-transformer';
import { Column } from 'typeorm';

@Exclude()
export class RidersResponseDto {
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
    name: 'cnic_number',
    type: 'varchar',
  })
  cnic_number: string;

  @Expose()
  @Column({
    name: 'bike_number',
    type: 'varchar',
  })
  bike_number: string;

  @Expose()
  @Column({
    name: 'profile_image_url',
    type: 'varchar',
  })
  profile_image_url: string;
}
