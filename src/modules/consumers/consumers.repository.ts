import { Injectable } from '@nestjs/common';;
import { DataSource, Repository } from 'typeorm';
import { ConsumersEntity } from  './entities/consumers.entity'

@Injectable()
export class ConsumersRepository extends Repository<ConsumersEntity> {
	constructor(private dataSource: DataSource) {
		super(ConsumersEntity, dataSource.createEntityManager());
	}
}