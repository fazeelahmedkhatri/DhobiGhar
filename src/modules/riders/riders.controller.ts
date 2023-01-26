import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { RidersService } from './riders.service';
import { RidersEntity } from  './entities/riders.entity'
import { CreateRidersDto } from './dto/create-riders.dto';
import { RidersResponseDto } from './dto/riders-response.dto';
import { UpdateRidersDto } from './dto/update-riders.dto';

@ApiTags('Riders')
@Controller({
	path: 'riders',
	version: '1',
})
export class RidersController extends ControllerFactory(
	RidersEntity,
	CreateRidersDto,
	UpdateRidersDto,
	RidersResponseDto,
) {
	constructor(private ridersService: RidersService ) {
		super(ridersService);
	}
}