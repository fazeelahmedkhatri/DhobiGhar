import { DefaultEntity } from '../../base/entities/base.entity';
import { UserRolesEntity } from '../../user_role/entities/user.role.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Gender_Enum } from '../../../common/enum';

@Entity('users')
export class UserEntity extends DefaultEntity {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
  })
  password: string;

  @Column({
    name: 'contact_number',
    length: 255,
    nullable: false,
    unique: true,
  })
  contact_number: string;

  @Column({
    name: 'city',
    nullable: true,
  })
  city: string;

  @Column({
    name: 'verified',
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @Column({
    name: 'full_name',
    nullable: true,
  })
  full_name: string;

  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: true,
  })
  birth_date: Date;

  @Column({
    type: 'enum',
    enum: Gender_Enum,
    nullable: true,
  })
  gender: Gender_Enum;

  @Column({
    name: 'rating',
    nullable: true,
  })
  rating: string;

  @Column({
    name: 'is_profile_completed',
    default: false,
  })
  is_profile_completed: boolean;

  @Column({
    name: 'login_flag',
    type: 'timestamptz',
    nullable: true,
  })
  login_flag: Date;

  @OneToMany(() => UserRolesEntity, (ur) => ur.users, { cascade: true })
  user_roles: UserRolesEntity[];
}
