import { Injectable } from '@nestjs/common';;
import { DataSource, Repository } from 'typeorm';
import { RidersEntity } from  './entities/riders.entity'

@Injectable()
export class RidersRepository extends Repository<RidersEntity> {
	constructor(private dataSource: DataSource) {
		super(RidersEntity, dataSource.createEntityManager());
	}
}