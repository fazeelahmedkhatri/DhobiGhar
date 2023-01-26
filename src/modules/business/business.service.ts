import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { BusinessEntity } from './entities/business.entity';
import { BusinessRepository } from './business.repository';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessResponseDto } from './dto/business-response.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService extends BaseService<
  BusinessEntity,
  CreateBusinessDto,
  UpdateBusinessDto,
  BusinessResponseDto
> {
  constructor(private businessRepository: BusinessRepository) {
    super(businessRepository);
  }
}
