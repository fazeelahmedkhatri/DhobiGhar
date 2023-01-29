import { UserEntity } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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

  @Column()
  user_id: number;

  @OneToOne(() => UserEntity, (users) => users.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  users: UserEntity;
}
