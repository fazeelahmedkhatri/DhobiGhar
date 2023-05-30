import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async FindUserWithRoleAndPassword(data: any): Promise<UserEntity[]> {
    const user = await this.dataSource.manager.query(`select
      u.id,
      u.full_name,
      email ,
      "password" ,
      contact_number,
      verified ,
      r.name as role_name,
      r.id as role_id
    from
      users u
    inner join user_roles ur on
      u.id = ur.user_id
    inner join roles r on
      r.id = ur.role_id
    where email= '${data.email}'
    group by
      u.id,
      u.full_name,
      email ,
      "password" ,
      "contact_number",
      r.name,
      r.id,
      verified;`);
    return user[0];
  }
}
