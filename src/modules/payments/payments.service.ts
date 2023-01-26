import { Injectable } from '@nestjs/common';;
import { BaseService } from '../base/base.service';
import { PaymentsEntity } from  './entities/payments.entity'
import { PaymentsRepository } from'./payments.repository';
import { CreatePaymentsDto } from './dto/create-payments.dto';
import { PaymentsResponseDto } from './dto/payments-response.dto';
import { UpdatePaymentsDto } from './dto/update-payments.dto';

@Injectable()
export class PaymentsService extends BaseService<
	PaymentsEntity,
	CreatePaymentsDto,
	UpdatePaymentsDto,
	PaymentsResponseDto
> {
	constructor(private paymentsRepository: PaymentsRepository ) {
		super(paymentsRepository);
	}
}