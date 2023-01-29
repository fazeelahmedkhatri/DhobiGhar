import { Exclude, Expose } from 'class-transformer';
import { Column } from 'typeorm';

@Exclude()
export class BusinessResponseDto {
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
    name: 'business_name',
    type: 'varchar',
  })
  business_name: string;

  @Expose()
  @Column({
    name: 'business_contact',
    type: 'varchar',
  })
  business_contact: string;

  @Expose()
  @Column({
    name: 'is_approved',
  })
  is_approved: boolean;

  @Expose()
  @Column({
    name: 'urgent_delivery',
  })
  urgent_delivery: boolean;

  @Expose()
  @Column({
    name: 'urgent_charges_percentage',
    type: 'int',
  })
  urgent_charges_percentage: number;
}
