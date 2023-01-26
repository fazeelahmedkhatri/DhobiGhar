import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { ConsumersService } from './consumers.service';
import { ConsumersEntity } from  './entities/consumers.entity'
import { CreateConsumersDto } from './dto/create-consumers.dto';
import { ConsumersResponseDto } from './dto/consumers-response.dto';
import { UpdateConsumersDto } from './dto/update-consumers.dto';

@ApiTags('Consumers')
@Controller({
	path: 'consumers',
	version: '1',
})
export class ConsumersController extends ControllerFactory(
	ConsumersEntity,
	CreateConsumersDto,
	UpdateConsumersDto,
	ConsumersResponseDto,
) {
	constructor(private consumersService: ConsumersService ) {
		super(consumersService);
	}
}