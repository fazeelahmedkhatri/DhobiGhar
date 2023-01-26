import { Exclude, Expose, Transform } from 'class-transformer';
import { Column } from 'typeorm';

@Exclude()
export class UserResponse {
  @Expose()
  @Column({
    name: 'id',
  })
  id: number;

  @Expose()
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
  })
  password: string;

  @Expose()
  @Column({
    name: 'verified',
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @Expose()
  @Column({
    name: 'phone_number',
    type: 'varchar',
  })
  contact_number: string;

  @Expose()
  @Column({
    name: 'role_id',
    type: 'int',
  })
  role_id: number;

  @Expose()
  @Column({
    name: 'role',
    type: 'varchar',
  })
  role: string;
}
