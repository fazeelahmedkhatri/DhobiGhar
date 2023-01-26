import { Injectable } from '@nestjs/common';;
import { DataSource, Repository } from 'typeorm';
import { BusinessEntity } from  './entities/business.entity'

@Injectable()
export class BusinessRepository extends Repository<BusinessEntity> {
	constructor(private dataSource: DataSource) {
		super(BusinessEntity, dataSource.createEntityManager());
	}
}