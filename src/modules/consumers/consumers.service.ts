import { Injectable } from '@nestjs/common';;
import { BaseService } from '../base/base.service';
import { ConsumersEntity } from  './entities/consumers.entity'
import { ConsumersRepository } from'./consumers.repository';
import { CreateConsumersDto } from './dto/create-consumers.dto';
import { ConsumersResponseDto } from './dto/consumers-response.dto';
import { UpdateConsumersDto } from './dto/update-consumers.dto';

@Injectable()
export class ConsumersService extends BaseService<
	ConsumersEntity,
	CreateConsumersDto,
	UpdateConsumersDto,
	ConsumersResponseDto
> {
	constructor(private consumersRepository: ConsumersRepository ) {
		super(consumersRepository);
	}
}