import { Injectable } from '@nestjs/common';;
import { BaseService } from '../base/base.service';
import { RidersEntity } from  './entities/riders.entity'
import { RidersRepository } from'./riders.repository';
import { CreateRidersDto } from './dto/create-riders.dto';
import { RidersResponseDto } from './dto/riders-response.dto';
import { UpdateRidersDto } from './dto/update-riders.dto';

@Injectable()
export class RidersService extends BaseService<
	RidersEntity,
	CreateRidersDto,
	UpdateRidersDto,
	RidersResponseDto
> {
	constructor(private ridersRepository: RidersRepository ) {
		super(ridersRepository);
	}
}