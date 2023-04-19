import { RidersRepository } from './../riders/riders.repository';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { AdminEntity } from './entities/admin.entity';
import { AdminRepository } from './admin.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { MESSAGES } from 'src/common/messages';
import { BusinessRepository } from '../business/business.repository';

@Injectable()
export class AdminService extends BaseService<
  AdminEntity,
  CreateAdminDto,
  UpdateAdminDto,
  AdminResponseDto
> {
  constructor(
    private adminRepository: AdminRepository,
    private ridersRepository: RidersRepository,
    private businessRepository: BusinessRepository,
  ) {
    super(adminRepository);
  }
  async ApproveRider(id: number) {
    try {
      const rider = await this.ridersRepository.findOne({
        where: {
          id,
        },
      });
      if (!rider) {
        throw new BadRequestException(MESSAGES.AUTH.ERROR.USER_NOT_EXIST);
      }
      rider.is_approved = true;
      const riders = this.ridersRepository.save(rider);
      return riders;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async ApproveBusinesss(id: number) {
    try {
      const business = await this.businessRepository.findOne({
        where: {
          id,
        },
      });
      if (!business) {
        throw new BadRequestException(MESSAGES.AUTH.ERROR.USER_NOT_EXIST);
      }
      business.is_approved = true;
      const businesses = this.businessRepository.save(business);
      return businesses;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async NotApprovedBusinesses() {
    try {
      const business = await this.businessRepository.find({
        where: {
          is_approved: false,
        },
      });

      return business;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async NotApprovedRiders() {
    try {
      const rider = await this.ridersRepository.find({
        where: {
          is_approved: false,
        },
      });

      return rider;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
