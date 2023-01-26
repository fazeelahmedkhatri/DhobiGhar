import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RidersController } from'./riders.controller';
import { RidersService } from'./riders.service';
import { RidersRepository } from'./riders.repository';
import { RidersEntity } from './entities/riders.entity'

@Module({
	imports: [TypeOrmModule.forFeature([RidersEntity])],
	providers: [RidersService, RidersRepository],
	controllers: [RidersController],
	exports: [RidersService]
})

export class RidersModule {}