import { Injectable } from '@nestjs/common';;
import { DataSource, Repository } from 'typeorm';
import { ServicesEntity } from  './entities/services.entity'

@Injectable()
export class ServicesRepository extends Repository<ServicesEntity> {
	constructor(private dataSource: DataSource) {
		super(ServicesEntity, dataSource.createEntityManager());
	}
}