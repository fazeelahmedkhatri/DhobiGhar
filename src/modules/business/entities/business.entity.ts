import { UserEntity } from '../../../modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

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
    name: 'business_contact',
    length: 255,
    nullable: false,
    unique: true,
  })
  business_contact: string;

  @Column({
    name: 'urgent_devliery',
    type: 'boolean',
    default: false,
  })
  urgent_deivery: boolean;

  @Column({
    name: 'urgent_charges_percentage',
    nullable: true,
  })
  urgent_charges_percentage: string;

  @Column()
  user_id: number;

  @OneToOne(() => UserEntity, (users) => users.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  users: UserEntity;
}
