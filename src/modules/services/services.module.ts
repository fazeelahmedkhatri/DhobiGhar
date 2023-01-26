import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from'./services.controller';
import { ServicesService } from'./services.service';
import { ServicesRepository } from'./services.repository';
import { ServicesEntity } from './entities/services.entity'

@Module({
	imports: [TypeOrmModule.forFeature([ServicesEntity])],
	providers: [ServicesService, ServicesRepository],
	controllers: [ServicesController],
	exports: [ServicesService]
})

export class ServicesModule {}