import { UserEntity } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';

@Entity('riders')
export class RidersEntity extends DefaultEntity {
  @Column({
    name: 'address',
    nullable: true,
  })
  address: string;

  @Column({
    name: 'cnic_number',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  cnic_number: string;

  @Column({
    name: 'bike_number',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  bike_number: string;

  @Column({
    name: 'is_approved',
    type: 'boolean',
    default: false,
  })
  is_approved: boolean;

  @Column({
    name: 'profile_image_url',
    nullable: true,
  })
  profile_image_url: string;

  @Column()
  user_id: number;

  @OneToOne(() => UserEntity, (users) => users.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  users: UserEntity;
}
