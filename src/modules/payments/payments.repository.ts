import { Injectable } from '@nestjs/common';;
import { DataSource, Repository } from 'typeorm';
import { PaymentsEntity } from  './entities/payments.entity'

@Injectable()
export class PaymentsRepository extends Repository<PaymentsEntity> {
	constructor(private dataSource: DataSource) {
		super(PaymentsEntity, dataSource.createEntityManager());
	}
}