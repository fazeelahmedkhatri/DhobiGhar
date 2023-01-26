import { Injectable } from '@nestjs/common';;
import { BaseService } from '../base/base.service';
import { ServicesEntity } from  './entities/services.entity'
import { ServicesRepository } from'./services.repository';
import { CreateServicesDto } from './dto/create-services.dto';
import { ServicesResponseDto } from './dto/services-response.dto';
import { UpdateServicesDto } from './dto/update-services.dto';

@Injectable()
export class ServicesService extends BaseService<
	ServicesEntity,
	CreateServicesDto,
	UpdateServicesDto,
	ServicesResponseDto
> {
	constructor(private servicesRepository: ServicesRepository ) {
		super(servicesRepository);
	}
}