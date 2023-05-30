import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { ServicesEntity } from './entities/services.entity';
import { ServicesRepository } from './services.repository';
import { CreateServicesDto } from './dto/create-services.dto';
import { ServicesResponseDto } from './dto/services-response.dto';
import { UpdateServicesDto } from './dto/update-services.dto';
import { DataSource } from 'typeorm';
import { BusinessServiceProductsEntity } from '../products/entities/business.service.products.entity';

@Injectable()
export class ServicesService extends BaseService<
  ServicesEntity,
  CreateServicesDto,
  UpdateServicesDto,
  ServicesResponseDto
> {
  constructor(
    private servicesRepository: ServicesRepository,
    private dataSource: DataSource,
  ) {
    super(servicesRepository);
  }
  async GetServicesByBusiness(business_id): Promise<any> {
    const query_runner = this.dataSource.createQueryRunner();
    const business_services = await query_runner.manager
      .getRepository(BusinessServiceProductsEntity)
      .createQueryBuilder('bsp')
      .select(['s.name'])
      .leftJoin('services', 's', 's.id = bsp.service_id')
      .where(`bsp.business_id='${business_id}'`)
      .getRawMany();
    return business_services;
  }
}
