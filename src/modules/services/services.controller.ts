import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { ServicesService } from './services.service';
import { ServicesEntity } from  './entities/services.entity'
import { CreateServicesDto } from './dto/create-services.dto';
import { ServicesResponseDto } from './dto/services-response.dto';
import { UpdateServicesDto } from './dto/update-services.dto';

@ApiTags('Services')
@Controller({
	path: 'services',
	version: '1',
})
export class ServicesController extends ControllerFactory(
	ServicesEntity,
	CreateServicesDto,
	UpdateServicesDto,
	ServicesResponseDto,
) {
	constructor(private servicesService: ServicesService ) {
		super(servicesService);
	}
}