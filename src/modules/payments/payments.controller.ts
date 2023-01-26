import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { PaymentsService } from './payments.service';
import { PaymentsEntity } from  './entities/payments.entity'
import { CreatePaymentsDto } from './dto/create-payments.dto';
import { PaymentsResponseDto } from './dto/payments-response.dto';
import { UpdatePaymentsDto } from './dto/update-payments.dto';

@ApiTags('Payments')
@Controller({
	path: 'payments',
	version: '1',
})
export class PaymentsController extends ControllerFactory(
	PaymentsEntity,
	CreatePaymentsDto,
	UpdatePaymentsDto,
	PaymentsResponseDto,
) {
	constructor(private paymentsService: PaymentsService ) {
		super(paymentsService);
	}
}