import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from'./payments.controller';
import { PaymentsService } from'./payments.service';
import { PaymentsRepository } from'./payments.repository';
import { PaymentsEntity } from './entities/payments.entity'

@Module({
	imports: [TypeOrmModule.forFeature([PaymentsEntity])],
	providers: [PaymentsService, PaymentsRepository],
	controllers: [PaymentsController],
	exports: [PaymentsService]
})

export class PaymentsModule {}