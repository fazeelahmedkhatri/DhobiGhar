import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { AdminEntity } from './entities/admin.entity';
import { RidersService } from '../riders/riders.service';
import { RidersRepository } from '../riders/riders.repository';
import { BusinessRepository } from '../business/business.repository';
import { BusinessService } from '../business/business.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  providers: [
    AdminService,
    AdminRepository,
    RidersService,
    RidersRepository,
    BusinessRepository,
    BusinessService,
  ],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
